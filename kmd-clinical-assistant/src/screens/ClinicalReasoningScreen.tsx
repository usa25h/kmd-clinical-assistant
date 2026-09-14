import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { useClinicalReasoning } from '../hooks/useClinicalReasoning';
import type { DiagnosticPattern, AcupointRecommendation } from '../hooks/useClinicalReasoning';
import type { RootStackParamList } from '../navigation/types';
import { useSession } from '../context/SessionContext';
import { fetchPrescription, type PrescriptionResponse, type PrescriptionPoint } from '../lib/api';

// ── Confidence bar ────────────────────────────────────────────────────────────

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${Math.round(value * 100)}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});

// ── Pattern card ──────────────────────────────────────────────────────────────

function PatternCard({ pattern, rank }: { pattern: DiagnosticPattern; rank: number }) {
  const colors = useTheme();
  const [expanded, setExpanded] = useState(rank === 0);
  const pct = Math.round(pattern.confidence * 100);
  const barColor = rank === 0 ? colors.accentFill : rank === 1 ? colors.warningFill : colors.textMuted;

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={[styles.patternCard, { backgroundColor: colors.surface1, borderColor: rank === 0 ? colors.accentFill : colors.border }]}
      accessibilityRole="button"
    >
      <View style={styles.patternHeader}>
        <View style={[styles.rankBadge, { backgroundColor: rank === 0 ? colors.accentFill : colors.surface2 }]}>
          <Text style={[styles.rankNum, { color: rank === 0 ? colors.accentText : colors.textMuted }]}>
            {rank + 1}
          </Text>
        </View>
        <View style={styles.patternNames}>
          <Text style={[styles.patternKorean, { color: colors.textPrimary }]}>{pattern.name}</Text>
          <Text style={[styles.patternHanja, { color: colors.textMuted }]}>{pattern.hanja}</Text>
        </View>
        <View style={styles.patternRight}>
          <Text style={[styles.pctText, { color: barColor }]}>{pct}%</Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.surface2 }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{pattern.category}</Text>
          </View>
        </View>
      </View>

      <ConfidenceBar value={pattern.confidence} color={barColor} />

      {expanded && (
        <View style={styles.patternBody}>
          <Text style={[styles.subsectionLabel, { color: colors.textMuted }]}>근거 증상</Text>
          <View style={styles.symptomRow}>
            {pattern.keySymptoms.map((s) => (
              <View key={s} style={[styles.symptomChip, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <Text style={[styles.symptomText, { color: colors.textSecondary }]}>{s}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.subsectionLabel, { color: colors.textMuted }]}>치법</Text>
          <Text style={[styles.treatmentText, { color: colors.textSecondary }]}>
            {pattern.treatmentPrinciple}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Acupoint row ──────────────────────────────────────────────────────────────

function AcupointRow({ point }: { point: AcupointRecommendation }) {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      style={[styles.acuRow, { borderColor: colors.border }]}
      onPress={() => navigation.navigate('AcupointDetail', { code: point.code })}
      accessibilityRole="button"
      accessibilityLabel={`${point.korean} 자침 요령 보기`}
    >
      <View style={[styles.acuCode, { backgroundColor: colors.accentSubtle }]}>
        <Text style={[styles.acuCodeText, { color: colors.accentFill }]}>{point.code}</Text>
      </View>
      <View style={styles.acuInfo}>
        <View style={styles.acuNameRow}>
          <Text style={[styles.acuKorean, { color: colors.textPrimary }]}>{point.korean}</Text>
          <Text style={[styles.acuHanja, { color: colors.textMuted }]}> {point.hanja}</Text>
        </View>
        <Text style={[styles.acuReason, { color: colors.textSecondary }]}>{point.reason}</Text>
        <Text style={[styles.acuLocation, { color: colors.textMuted }]}>{point.location}</Text>
      </View>
      <Text style={[styles.acuChevron, { color: colors.textMuted }]}>›</Text>
    </Pressable>
  );
}

// ── Saam prescription card ────────────────────────────────────────────────────

const ACTION_COLOR: Record<string, string> = {
  보: '#22c55e',
  사: '#ef4444',
};

function SaamPointRow({ pt }: { pt: PrescriptionPoint }) {
  const colors = useTheme();
  const action = pt.action;
  const dotColor = ACTION_COLOR[action] ?? colors.accentFill;
  return (
    <View style={saamStyles.row}>
      <View style={[saamStyles.orderBadge, { backgroundColor: colors.surface2 }]}>
        <Text style={[saamStyles.orderText, { color: colors.textMuted }]}>{pt.order}</Text>
      </View>
      <View style={[saamStyles.codeBadge, { backgroundColor: colors.accentSubtle }]}>
        <Text style={[saamStyles.codeText, { color: colors.accentFill }]}>{pt.point_code}</Text>
      </View>
      <Text style={[saamStyles.pointName, { color: colors.textPrimary }]}>{pt.point}</Text>
      <Text style={[saamStyles.side, { color: colors.textSecondary }]}>{pt.side}</Text>
      <View style={[saamStyles.actionBadge, { backgroundColor: dotColor + '22' }]}>
        <Text style={[saamStyles.actionText, { color: dotColor }]}>{action}</Text>
      </View>
    </View>
  );
}

function SaamPrescriptionPanel({ result }: { result: PrescriptionResponse }) {
  const colors = useTheme();
  const confidenceColor =
    result.confidence === 'high' ? '#22c55e' : result.confidence === 'medium' ? '#f59e0b' : '#ef4444';
  const imbalanceColor = result.diagnosis.imbalance_type?.startsWith('허') ? '#60a5fa' : '#f97316';

  return (
    <View style={saamStyles.panelWrap}>
      {/* 변증 분석 dark card */}
      <View style={[saamStyles.diagCard, { backgroundColor: '#0f172a', borderColor: colors.accentFill + '44' }]}>
        <Text style={saamStyles.diagTitle}>변증 분석</Text>
        <View style={saamStyles.diagGrid}>
          <View style={saamStyles.diagCell}>
            <Text style={saamStyles.diagLabel}>패턴</Text>
            <Text style={saamStyles.diagValue}>{result.diagnosis.pattern}</Text>
          </View>
          <View style={saamStyles.diagCell}>
            <Text style={saamStyles.diagLabel}>주 경락</Text>
            <Text style={saamStyles.diagValue}>{result.diagnosis.primary_meridian}</Text>
          </View>
          {result.diagnosis.secondary_meridian && (
            <View style={saamStyles.diagCell}>
              <Text style={saamStyles.diagLabel}>보조 경락</Text>
              <Text style={saamStyles.diagValue}>{result.diagnosis.secondary_meridian}</Text>
            </View>
          )}
          <View style={saamStyles.diagCell}>
            <Text style={saamStyles.diagLabel}>허/실</Text>
            <Text style={[saamStyles.diagValue, { color: imbalanceColor }]}>{result.diagnosis.imbalance_type}</Text>
          </View>
        </View>
        <View style={[saamStyles.confBadge, { backgroundColor: confidenceColor + '22', alignSelf: 'flex-start', marginTop: spacing[2] }]}>
          <Text style={[saamStyles.confText, { color: confidenceColor }]}>신뢰도: {result.confidence}</Text>
        </View>
      </View>

      {/* 사암 처방 card */}
      <View style={[saamStyles.panel, { backgroundColor: colors.surface1, borderColor: colors.accentFill + '55' }]}>
        <View style={saamStyles.panelHeader}>
          <Text style={[saamStyles.patternLabel, { color: colors.textPrimary }]}>
            사암침 {result.prescription.method}
          </Text>
        </View>

        <View style={[saamStyles.pointList, { borderColor: colors.border }]}>
          {result.prescription.points.map((pt) => (
            <SaamPointRow key={`${pt.point_code}-${pt.order}`} pt={pt} />
          ))}
        </View>

        {/* Secondary treatment */}
        {result.secondary_treatment?.points && result.secondary_treatment.points.length > 0 && (
          <View style={[saamStyles.secondaryBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
            <Text style={[saamStyles.secondaryTitle, { color: colors.textMuted }]}>보조혈</Text>
            <Text style={[saamStyles.rationaleText, { color: colors.textSecondary }]}>
              {result.secondary_treatment.points.join(', ')}
            </Text>
            {result.secondary_treatment.notes && (
              <Text style={[saamStyles.rationaleText, { color: colors.textSecondary, marginTop: 4 }]}>
                {result.secondary_treatment.notes}
              </Text>
            )}
          </View>
        )}

        {/* Rationale */}
        <View style={[saamStyles.rationalBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[saamStyles.secondaryTitle, { color: colors.textMuted }]}>처방 근거</Text>
          <Text style={[saamStyles.rationaleText, { color: colors.textSecondary }]}>
            {result.rationale}
          </Text>
        </View>

        {/* Caution */}
        {result.caution ? (
          <View style={[saamStyles.cautionBox, { backgroundColor: '#ef444422', borderColor: '#ef4444' }]}>
            <Text style={[saamStyles.cautionText, { color: '#ef4444' }]}>⚠ {result.caution}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function ClinicalReasoningScreen() {
  const colors = useTheme();
  const { patterns, acupoints, evidenceChips, isLoading } = useClinicalReasoning();
  const { session } = useSession();
  const [saamResult, setSaamResult] = useState<PrescriptionResponse | null>(null);
  const [saamLoading, setSaamLoading] = useState(false);
  const [saamError, setSaamError] = useState<string | null>(null);

  const handleSaamPrescription = async () => {
    setSaamLoading(true);
    setSaamError(null);
    setSaamResult(null);
    try {
      const pulseDesc = [
        session.pulse.buChim !== 0 ? `부침${session.pulse.buChim > 0 ? '+' : ''}${session.pulse.buChim}` : null,
        session.pulse.jiSak !== 0 ? `지삭${session.pulse.jiSak > 0 ? '+' : ''}${session.pulse.jiSak}` : null,
        session.pulse.heoSil !== 0 ? `허실${session.pulse.heoSil > 0 ? '+' : ''}${session.pulse.heoSil}` : null,
      ]
        .filter(Boolean)
        .join(', ');

      const { patientInfo } = session;
      const result = await fetchPrescription({
        age: patientInfo.age,
        gender: patientInfo.gender,
        chief_complaint: session.chiefComplaints.join(', ') || '통증',
        affected_side: patientInfo.affectedSide ?? undefined,
        secondary_symptoms: session.tongueFindings.length > 0 ? session.tongueFindings : undefined,
        pulse: pulseDesc || undefined,
        tongue: session.tongueFindings.join(', ') || undefined,
        duration: patientInfo.duration ?? undefined,
        additional_notes: [
          patientInfo.bodyType ? `체형: ${patientInfo.bodyType}` : null,
          patientInfo.heightCm && patientInfo.weightKg
            ? `키: ${patientInfo.heightCm}cm, 몸무게: ${patientInfo.weightKg}kg`
            : null,
        ].filter(Boolean).join('; ') || undefined,
      });
      setSaamResult(result);
    } catch (e: unknown) {
      setSaamError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setSaamLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface0 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accentFill} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            AI 변증 분석 중…
          </Text>
        </View>
      )}

      {/* Evidence summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>수집된 증거</Text>
        <View style={styles.chipRow}>
          {evidenceChips.map((chip) => (
            <View key={chip} style={[styles.evidenceChip, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
              <Text style={[styles.evidenceText, { color: colors.textSecondary }]}>{chip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Diagnostic patterns */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>변증 결과</Text>
        {patterns.map((p, i) => (
          <PatternCard key={p.id} pattern={p} rank={i} />
        ))}
      </View>

      {/* Acupoint recommendations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>추천 경혈</Text>
        <View style={[styles.acuList, { borderColor: colors.border, backgroundColor: colors.surface1 }]}>
          {acupoints.map((pt, i) => (
            <React.Fragment key={pt.id}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <AcupointRow point={pt} />
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Saam prescription */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>사암침 처방</Text>
        <Pressable
          onPress={handleSaamPrescription}
          disabled={saamLoading}
          style={({ pressed }) => [
            saamStyles.button,
            { backgroundColor: pressed ? colors.accentFill + 'cc' : colors.accentFill },
            saamLoading && { opacity: 0.6 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="사암침 AI 처방 생성"
        >
          {saamLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={saamStyles.buttonText}>사암침 AI 처방 생성</Text>
          )}
        </Pressable>

        {saamError && (
          <Text style={[saamStyles.errorText, { color: '#ef4444' }]}>{saamError}</Text>
        )}

        {saamResult && <SaamPrescriptionPanel result={saamResult} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[8],
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  evidenceChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    borderWidth: 1,
  },
  evidenceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  // Pattern card
  patternCard: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  patternNames: {
    flex: 1,
    gap: 2,
  },
  patternKorean: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  patternHanja: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  patternRight: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  pctText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  patternBody: {
    gap: spacing[2],
  },
  subsectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  symptomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  symptomChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  symptomText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  treatmentText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  // Acupoint list
  acuList: {
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  acuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
  },
  acuCode: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
    minWidth: 52,
    alignItems: 'center',
  },
  acuCodeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  acuInfo: {
    flex: 1,
    gap: 3,
  },
  acuNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  acuKorean: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  acuHanja: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  acuReason: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  acuLocation: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  acuChevron: {
    fontSize: typography.fontSize.lg,
    alignSelf: 'center',
    paddingLeft: spacing[2],
  },
  divider: {
    height: 1,
    marginHorizontal: spacing[4],
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
  },
});

const saamStyles = StyleSheet.create({
  button: {
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing[2],
  },
  panelWrap: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  // 변증 분석 dark card
  diagCard: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  diagTitle: {
    color: '#e2e8f0',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  diagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  diagCell: {
    gap: 2,
    minWidth: 80,
  },
  diagLabel: {
    color: '#64748b',
    fontSize: typography.fontSize.xs,
  },
  diagValue: {
    color: '#f1f5f9',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  panel: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patternLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  confBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  confText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  pointList: {
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  secondaryBox: {
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing[3],
    gap: 4,
  },
  rationalBox: {
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing[3],
    gap: 4,
  },
  secondaryTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  orderBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  codeBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
    minWidth: 52,
    alignItems: 'center',
  },
  codeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  pointName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  side: {
    fontSize: typography.fontSize.xs,
  },
  actionBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  rationaleText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  cautionBox: {
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing[3],
  },
  cautionText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
});
