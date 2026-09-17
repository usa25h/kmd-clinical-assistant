import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { callWorkerApi, type WorkerPrescription, type AcuPoint, type TungPoint } from '../lib/workerApi';
import type { RootStackParamList } from '../navigation/types';

const QUICK_DIAGNOSES = [
  '구안와사', '요통', '경항통', '두통', '편두통',
  '불면', '소화불량', '이명', '어지럼증', '천식·기침',
  '슬관절통', '어깨통증', '좌골신경통', '월경통', '고혈압',
];

const GENDER_OPTIONS = ['남', '여'];

export function QuickPrescriptionScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [symptom, setSymptom] = useState('');
  const [ageText, setAgeText] = useState('');
  const [gender, setGender] = useState('남');
  const [result, setResult] = useState<WorkerPrescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const toggleChip = (diagnosis: string) => {
    setSymptom((prev) => {
      const parts = prev.split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.includes(diagnosis)) {
        return parts.filter((p) => p !== diagnosis).join(', ');
      }
      return parts.length ? `${prev.trim()}, ${diagnosis}` : diagnosis;
    });
  };

  const isChipSelected = (d: string) =>
    symptom.split(/[,，、\s]+/).map((s) => s.trim()).includes(d);

  const handleGenerate = async () => {
    const age = parseInt(ageText, 10);
    if (!symptom.trim()) return;
    if (!ageText.trim() || isNaN(age) || age < 1 || age > 120) {
      setError('나이를 올바르게 입력해 주세요 (1–120).');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const data = await callWorkerApi({ age, gender, symptom: symptom.trim() });
      setResult(data);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (e) {
      setError(e instanceof Error ? e.message : '처방 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = !!symptom.trim() && !!ageText.trim() && !isLoading;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.surface0 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Input card ─────────────────────────────────────────────────── */}
        <View style={[styles.inputCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>진단·증상 입력</Text>

          {/* Age + Gender row */}
          <View style={styles.patientRow}>
            <View style={styles.ageWrap}>
              <TextInput
                style={[styles.ageInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface0 }]}
                placeholder="나이"
                placeholderTextColor={colors.textMuted}
                value={ageText}
                onChangeText={setAgeText}
                keyboardType="number-pad"
                maxLength={3}
                returnKeyType="done"
                accessibilityLabel="나이 입력"
              />
            </View>
            <View style={styles.genderWrap}>
              {GENDER_OPTIONS.map((g) => {
                const sel = gender === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setGender(g)}
                    style={[
                      styles.genderChip,
                      {
                        backgroundColor: sel ? colors.accentFill : colors.surface0,
                        borderColor: sel ? colors.accentFill : colors.border,
                      },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: sel }}
                  >
                    <Text style={[styles.genderText, { color: sel ? colors.accentText : colors.textSecondary }]}>
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Symptom text */}
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface0 }]}
            placeholder="예: 구안와사, 두통, 이명"
            placeholderTextColor={colors.textMuted}
            value={symptom}
            onChangeText={setSymptom}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            returnKeyType="default"
            accessibilityLabel="증상 입력"
          />

          {/* Quick-select chips */}
          <View style={styles.chipWrap}>
            {QUICK_DIAGNOSES.map((d) => {
              const sel = isChipSelected(d);
              return (
                <Pressable
                  key={d}
                  onPress={() => toggleChip(d)}
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: sel ? colors.accentFill : colors.surface2,
                      borderColor: sel ? colors.accentFill : colors.border,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sel }}
                >
                  <Text style={[styles.quickChipText, { color: sel ? colors.accentText : colors.textSecondary }]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Generate button */}
          <Pressable
            style={[styles.generateBtn, { backgroundColor: canGenerate ? colors.accentFill : colors.surface2 }]}
            onPress={handleGenerate}
            disabled={!canGenerate}
            accessibilityRole="button"
            accessibilityLabel="침 처방 생성"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accentText} />
            ) : (
              <Text style={[styles.generateBtnText, { color: canGenerate ? colors.accentText : colors.textMuted }]}>
                처방 생성 →
              </Text>
            )}
          </Pressable>
        </View>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {!!error && (
          <View style={[styles.errorBox, { backgroundColor: '#FFF1F0', borderColor: '#FFA39E' }]}>
            <Text style={[styles.errorText, { color: '#CF1322' }]}>{error}</Text>
          </View>
        )}

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {isLoading && (
          <View style={[styles.loadingCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <ActivityIndicator size="large" color={colors.accentFill} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              사암침·동씨침·총통침 처방 분석 중…
            </Text>
          </View>
        )}

        {/* ── Reference shortcuts ───────────────────────────────────────── */}
        <View style={styles.refRow}>
          {(
            [
              { label: '사암침', screen: 'SaamLookup' },
              { label: '동씨침', screen: 'DongsLookup' },
              { label: '총통침', screen: 'ChongtongLookup' },
              { label: '원문 아카이브', screen: 'DongsArchive' },
            ] as const
          ).map(({ label, screen }) => (
            <Pressable
              key={screen}
              style={[styles.refButton, { backgroundColor: colors.surface1, borderColor: colors.border }]}
              onPress={() => navigation.navigate(screen)}
              accessibilityRole="button"
            >
              <Text style={[styles.refLabel, { color: colors.textPrimary }]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Result ─────────────────────────────────────────────────────── */}
        {result && !isLoading && (
          <PrescriptionResult
            data={result}
            colors={colors}
            onTapCode={(code) => navigation.navigate('AcupointDetail', { code })}
            onClear={() => { setResult(null); setSymptom(''); setAgeText(''); }}
          />
        )}

        <View style={{ height: spacing[10] }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Structured prescription result ───────────────────────────────────────────

function SectionHeader({ title, colors }: { title: string; colors: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.accentSubtle }]}>
      <Text style={[styles.sectionHeaderText, { color: colors.accentFill }]}>{title}</Text>
    </View>
  );
}

function PointRow({
  point,
  colors,
  onTapCode,
}: {
  point: AcuPoint | TungPoint;
  colors: ReturnType<typeof useTheme>;
  onTapCode: (code: string) => void;
}) {
  return (
    <View style={styles.pointRow}>
      <Text style={[styles.pointOrder, { color: colors.textMuted }]}>{point.order}.</Text>
      <View style={styles.pointBody}>
        <View style={styles.pointTitleRow}>
          <Text
            style={[styles.pointCode, { color: colors.accentFill, backgroundColor: colors.accentSubtle }]}
            onPress={() => onTapCode(point.point_code)}
            suppressHighlighting
          >
            {point.point_code}
          </Text>
          <Text style={[styles.pointName, { color: colors.textPrimary }]}>{point.point}</Text>
          <Text style={[styles.pointMeta, { color: colors.textMuted }]}>{point.side} · {point.action}</Text>
        </View>
        {'indication' in point && (point as TungPoint).indication ? (
          <Text style={[styles.pointIndication, { color: colors.textSecondary }]}>
            {(point as TungPoint).indication}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function PrescriptionResult({
  data,
  colors,
  onTapCode,
  onClear,
}: {
  data: WorkerPrescription;
  colors: ReturnType<typeof useTheme>;
  onTapCode: (code: string) => void;
  onClear: () => void;
}) {
  const confidencePct = Math.round(data.confidence * 100);

  return (
    <View style={[styles.resultCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>처방 결과</Text>
        <View style={styles.resultHeaderRight}>
          <Text style={[styles.confidenceBadge, { color: colors.textMuted }]}>{confidencePct}%</Text>
          <Pressable
            onPress={onClear}
            style={[styles.clearBtn, { backgroundColor: colors.surface2 }]}
            accessibilityRole="button"
            accessibilityLabel="초기화"
          >
            <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>초기화</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Diagnosis */}
      <Text style={[styles.diagnosisText, { color: colors.textPrimary }]}>{data.diagnosis}</Text>

      {/* Primary prescription */}
      <SectionHeader title={`주 처방 — ${data.prescription.method}`} colors={colors} />
      {data.prescription.points.map((p) => (
        <PointRow key={p.order} point={p} colors={colors} onTapCode={onTapCode} />
      ))}

      {/* Secondary treatment */}
      {!!data.secondary_treatment && (
        <>
          <SectionHeader title="보조 처방" colors={colors} />
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{data.secondary_treatment}</Text>
        </>
      )}

      {/* Tung acupuncture */}
      {data.tung_acupuncture.points.length > 0 && (
        <>
          <SectionHeader title="동씨침" colors={colors} />
          {data.tung_acupuncture.points.map((p) => (
            <PointRow key={p.order} point={p} colors={colors} onTapCode={onTapCode} />
          ))}
          {!!data.tung_acupuncture.notes && (
            <Text style={[styles.notesText, { color: colors.textMuted }]}>{data.tung_acupuncture.notes}</Text>
          )}
        </>
      )}

      {/* Rationale */}
      {!!data.rationale && (
        <>
          <SectionHeader title="처방 근거" colors={colors} />
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{data.rationale}</Text>
        </>
      )}

      {/* Caution */}
      {!!data.caution && (
        <View style={[styles.cautionBox, { backgroundColor: '#FFF7E6', borderColor: '#FFD591' }]}>
          <Text style={[styles.cautionText, { color: '#874D00' }]}>⚠ {data.caution}</Text>
        </View>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4] },

  inputCard: { borderRadius: radii.lg, borderWidth: 1, padding: spacing[4], gap: spacing[3] },
  inputLabel: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },

  patientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  ageWrap: { flex: 1 },
  ageInput: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[2],
    fontSize: typography.fontSize.base,
    textAlign: 'center',
  },
  genderWrap: { flexDirection: 'row', gap: spacing[2] },
  genderChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    borderWidth: 1,
  },
  genderText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },

  textInput: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    minHeight: 72,
    lineHeight: typography.fontSize.base * 1.6,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  quickChip: { paddingHorizontal: spacing[3], paddingVertical: spacing[1] + 2, borderRadius: radii.full, borderWidth: 1 },
  quickChipText: { fontSize: typography.fontSize.sm },

  generateBtn: { borderRadius: radii.md, paddingVertical: spacing[3], alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  generateBtnText: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },

  refRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  refButton: { flexGrow: 1, flexBasis: '45%', borderRadius: radii.md, borderWidth: 1, paddingVertical: spacing[3], alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  refLabel: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },

  errorBox: { borderRadius: radii.md, borderWidth: 1, padding: spacing[3] },
  errorText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },

  loadingCard: { borderRadius: radii.lg, borderWidth: 1, padding: spacing[8], alignItems: 'center', gap: spacing[3] },
  loadingText: { fontSize: typography.fontSize.sm, textAlign: 'center' },

  resultCard: { borderRadius: radii.lg, borderWidth: 1, padding: spacing[4], gap: spacing[3] },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },
  resultHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  confidenceBadge: { fontSize: typography.fontSize.xs },
  clearBtn: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radii.sm },
  clearBtnText: { fontSize: typography.fontSize.sm },
  divider: { height: 1 },

  diagnosisText: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, lineHeight: typography.fontSize.base * 1.6 },

  sectionHeader: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radii.sm, marginTop: spacing[1] },
  sectionHeaderText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },

  pointRow: { flexDirection: 'row', gap: spacing[2], paddingVertical: spacing[1] },
  pointOrder: { fontSize: typography.fontSize.sm, width: 18, paddingTop: 2 },
  pointBody: { flex: 1, gap: 2 },
  pointTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' },
  pointCode: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, borderRadius: 3, overflow: 'hidden', paddingHorizontal: 4, paddingVertical: 1 },
  pointName: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
  pointMeta: { fontSize: typography.fontSize.xs },
  pointIndication: { fontSize: typography.fontSize.xs, lineHeight: typography.fontSize.xs * 1.5 },

  bodyText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.7 },
  notesText: { fontSize: typography.fontSize.xs, lineHeight: typography.fontSize.xs * 1.6, fontStyle: 'italic' },

  cautionBox: { borderRadius: radii.md, borderWidth: 1, padding: spacing[3] },
  cautionText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },
});
