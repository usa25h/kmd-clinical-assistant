import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { useClinicalReasoning } from '../hooks/useClinicalReasoning';
import type { DiagnosticPattern, AcupointRecommendation } from '../hooks/useClinicalReasoning';
import type { RootStackParamList } from '../navigation/types';

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

// ── Screen ────────────────────────────────────────────────────────────────────

export function ClinicalReasoningScreen() {
  const colors = useTheme();
  const { patterns, acupoints, evidenceChips, isLoading } = useClinicalReasoning();

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
