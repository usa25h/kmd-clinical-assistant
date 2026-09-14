import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { useSTT, type STTField } from '../hooks';
import { useSession } from '../context/SessionContext';
import type { PatientInfo } from '../context/SessionContext';
import type { RootStackParamList } from '../navigation/types';
import {
  VoiceRecordingPanel,
  Chip,
  ChipRow,
  ChipCorrectionPopover,
  PulseSliderRow,
  TimeRemainingBadge,
} from '../components';

// ─── Static data ──────────────────────────────────────────────────────────────

const CHIEF_COMPLAINT_CHIPS = [
  '두통', '복통', '요통', '경항통', '소화불량',
  '불면', '피로감', '어지럼증', '기침', '호흡곤란',
];

const TONGUE_CHIPS = [
  '담홍설', '홍설', '담백설', '자설',
  '박백태', '황태', '백니태', '무태',
  '치흔설', '열문설',
];

const BODY_TYPE_CHIPS = ['마른형', '보통형', '비만형', '근육형', '부종형'];
const AFFECTED_SIDE_CHIPS = ['좌측', '우측', '양측', '없음'];
const DURATION_CHIPS = ['1일 이내', '1주 이내', '1개월 이내', '3개월 이내', '6개월 이상', '1년 이상'];

// Total "slots" used for time-remaining estimate
const TOTAL_SLOTS = CHIEF_COMPLAINT_CHIPS.length + TONGUE_CHIPS.length + 2; // +2 for buChim, jiSak
const SECONDS_PER_SLOT = 3;

// Low-confidence threshold: chips below this show the amber "(오인식?)" variant
const LOW_CONF_THRESHOLD = 0.7;

function bmi(weightKg: number, heightCm: number) {
  const h = heightCm / 100;
  return (weightKg / (h * h)).toFixed(1);
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ChiefComplaintScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { session, dispatch } = useSession();
  const stt = useSTT();

  // Patient basic info
  const [age, setAge] = useState(String(session.patientInfo.age));
  const [gender, setGender] = useState<'남' | '여' | '미지정'>(session.patientInfo.gender);
  const [heightCm, setHeightCm] = useState(session.patientInfo.heightCm ? String(session.patientInfo.heightCm) : '');
  const [weightKg, setWeightKg] = useState(session.patientInfo.weightKg ? String(session.patientInfo.weightKg) : '');
  const [bodyType, setBodyType] = useState<string | null>(session.patientInfo.bodyType);
  const [affectedSide, setAffectedSide] = useState<string | null>(session.patientInfo.affectedSide);
  const [duration, setDuration] = useState<string | null>(session.patientInfo.duration);

  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  const bmiValue = h > 0 && w > 0 ? bmi(w, h) : null;

  // Quick-select state
  const [selectedCC, setSelectedCC] = useState<Set<string>>(new Set());
  const [selectedTongue, setSelectedTongue] = useState<Set<string>>(new Set());

  // Pulse sliders: -2 (left pole) … 0 (center) … +2 (right pole)
  const [pulse, setPulse] = useState({ buChim: 0, jiSak: 0, heoSil: 0 });
  const [showHeoSil, setShowHeoSil] = useState(false);

  // Disable ScrollView scroll while a slider thumb is being dragged
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Correction popover state
  const [popover, setPopover] = useState<{ visible: boolean; field: STTField | null }>({
    visible: false,
    field: null,
  });

  // Auto-highlight chief-complaint chips that appear verbatim in STT output
  useEffect(() => {
    if (stt.extractedFields.length === 0) return;
    const sttText = stt.extractedFields.map((f) => f.label).join(' ');
    setSelectedCC((prev) => {
      const next = new Set(prev);
      CHIEF_COMPLAINT_CHIPS.forEach((chip) => {
        if (sttText.includes(chip)) next.add(chip);
      });
      return next;
    });
  }, [stt.extractedFields]);

  // Estimated seconds remaining based on unfilled slots
  const filledCount =
    selectedCC.size +
    selectedTongue.size +
    (pulse.buChim !== 0 ? 1 : 0) +
    (pulse.jiSak !== 0 ? 1 : 0);
  const secondsLeft = Math.max(0, Math.round((TOTAL_SLOTS - filledCount) * SECONDS_PER_SLOT));

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleCC = (label: string) =>
    setSelectedCC((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const toggleTongue = (label: string) =>
    setSelectedTongue((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const openPopover = (field: STTField) => setPopover({ visible: true, field });
  const closePopover = () => setPopover({ visible: false, field: null });

  const handleCorrection = (newLabel: string) => {
    if (popover.field) stt.correctField(popover.field.id, newLabel);
    closePopover();
  };

  const isLowConf = (f: STTField) => f.confidence < LOW_CONF_THRESHOLD;

  const handleProceed = useCallback(() => {
    const parsedAge = parseInt(age, 10);
    const patientInfo: PatientInfo = {
      age: isNaN(parsedAge) ? 45 : parsedAge,
      gender,
      heightCm: h > 0 ? h : null,
      weightKg: w > 0 ? w : null,
      bodyType,
      affectedSide,
      duration,
    };
    dispatch({ type: 'SET_PATIENT_INFO', info: patientInfo });
    dispatch({
      type: 'SET_CHIEF_COMPLAINT',
      complaints: Array.from(selectedCC),
      tongue: Array.from(selectedTongue),
      pulse,
    });
    navigation.navigate('AIInterview');
  }, [dispatch, navigation, selectedCC, selectedTongue, pulse, age, gender, h, w, bodyType, affectedSide, duration]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.flex, { backgroundColor: colors.surface0 }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
      >
        {/* ① Patient basic info form */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>기본정보</Text>

          {/* Age + Gender row */}
          <View style={styles.rowGap}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>나이</Text>
              <TextInput
                style={[styles.numInput, { backgroundColor: colors.surface0, color: colors.textPrimary, borderColor: colors.border }]}
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                maxLength={3}
                placeholder="45"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>성별</Text>
              <View style={styles.genderRow}>
                {(['남', '여', '미지정'] as const).map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setGender(g)}
                    style={[
                      styles.genderChip,
                      { borderColor: gender === g ? colors.accentFill : colors.border,
                        backgroundColor: gender === g ? colors.accentSubtle : colors.surface0 },
                    ]}
                  >
                    <Text style={[styles.genderChipText, { color: gender === g ? colors.accentFill : colors.textSecondary }]}>{g}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Height + Weight + BMI */}
          <View style={styles.rowGap}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>키 (cm)</Text>
              <TextInput
                style={[styles.numInput, { backgroundColor: colors.surface0, color: colors.textPrimary, borderColor: colors.border }]}
                keyboardType="decimal-pad"
                value={heightCm}
                onChangeText={setHeightCm}
                maxLength={5}
                placeholder="170"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>몸무게 (kg)</Text>
              <TextInput
                style={[styles.numInput, { backgroundColor: colors.surface0, color: colors.textPrimary, borderColor: colors.border }]}
                keyboardType="decimal-pad"
                value={weightKg}
                onChangeText={setWeightKg}
                maxLength={5}
                placeholder="70"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {bmiValue && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>BMI</Text>
                <View style={[styles.bmiBadge, { backgroundColor: colors.accentSubtle }]}>
                  <Text style={[styles.bmiValue, { color: colors.accentFill }]}>{bmiValue}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Body type */}
          <View>
            <Text style={[styles.fieldLabel, { color: colors.textMuted, marginBottom: spacing[2] }]}>체형</Text>
            <View style={styles.chipWrap}>
              {BODY_TYPE_CHIPS.map((bt) => (
                <Pressable
                  key={bt}
                  onPress={() => setBodyType(bodyType === bt ? null : bt)}
                  style={[
                    styles.smallChip,
                    { borderColor: bodyType === bt ? colors.accentFill : colors.border,
                      backgroundColor: bodyType === bt ? colors.accentSubtle : colors.surface0 },
                  ]}
                >
                  <Text style={[styles.smallChipText, { color: bodyType === bt ? colors.accentFill : colors.textSecondary }]}>{bt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* ② Recording section header + countdown badge */}
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>음성 녹음</Text>
          <TimeRemainingBadge seconds={secondsLeft} />
        </View>

        {/* ② Voice recording panel */}
        <VoiceRecordingPanel
          isRecording={stt.isRecording}
          liveTranscript={stt.liveTranscript}
          onStartRecording={stt.startRecording}
          onStopRecording={stt.stopRecording}
        />

        {/* ③ STT-extracted chip area */}
        {stt.extractedFields.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>인식된 내용</Text>
            <View style={styles.chipWrap}>
              {stt.extractedFields.map((field) => {
                const low = isLowConf(field);
                return (
                  <Chip
                    key={field.id}
                    label={low ? `${field.label} (오인식?)` : field.label}
                    variant={low ? 'low-confidence' : 'default'}
                    onPress={() => openPopover(field)}
                  />
                );
              })}
              {/* Add-new chip as affordance for manual additions */}
              <Chip label="추가" variant="add-new" onPress={() => {}} />
            </View>
          </View>
        )}

        {/* ④ Chief Complaint quick-select */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            주소증 (chief complaint)
          </Text>
          <ChipRow
            chips={CHIEF_COMPLAINT_CHIPS.map((c) => ({
              id: c,
              label: c,
              variant: selectedCC.has(c) ? 'selected' : 'default',
            }))}
            onPress={toggleCC}
          />
        </View>

        {/* ④b Affected Side */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>환측 (affected side)</Text>
          <View style={styles.chipWrap}>
            {AFFECTED_SIDE_CHIPS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setAffectedSide(affectedSide === s ? null : s)}
                style={[
                  styles.smallChip,
                  { borderColor: affectedSide === s ? colors.accentFill : colors.border,
                    backgroundColor: affectedSide === s ? colors.accentSubtle : colors.surface1 },
                ]}
              >
                <Text style={[styles.smallChipText, { color: affectedSide === s ? colors.accentFill : colors.textSecondary }]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ④c Duration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>이환기간 (duration)</Text>
          <View style={styles.chipWrap}>
            {DURATION_CHIPS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDuration(duration === d ? null : d)}
                style={[
                  styles.smallChip,
                  { borderColor: duration === d ? colors.accentFill : colors.border,
                    backgroundColor: duration === d ? colors.accentSubtle : colors.surface1 },
                ]}
              >
                <Text style={[styles.smallChipText, { color: duration === d ? colors.accentFill : colors.textSecondary }]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ④d Tongue Diagnosis quick-select */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            설진 (tongue diagnosis)
          </Text>
          <ChipRow
            chips={TONGUE_CHIPS.map((c) => ({
              id: c,
              label: c,
              variant: selectedTongue.has(c) ? 'selected' : 'default',
            }))}
            onPress={toggleTongue}
          />
        </View>

        {/* ⑤ Pulse Diagnosis — paired sliders */}
        <View style={[styles.section, { backgroundColor: colors.surface1, borderRadius: radii.lg, padding: spacing[4] }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            맥진 (pulse diagnosis)
          </Text>

          <PulseSliderRow
            leftLabel={'부(浮)'}
            rightLabel={'침(沈)'}
            value={pulse.buChim}
            onChange={(v) => setPulse((p) => ({ ...p, buChim: v }))}
            onDragStart={() => setScrollEnabled(false)}
            onDragEnd={() => setScrollEnabled(true)}
          />

          <PulseSliderRow
            leftLabel={'지(遲)'}
            rightLabel={'삭(數)'}
            value={pulse.jiSak}
            onChange={(v) => setPulse((p) => ({ ...p, jiSak: v }))}
            onDragStart={() => setScrollEnabled(false)}
            onDragEnd={() => setScrollEnabled(true)}
          />

          {/* ⑥ Accordion: 허/실 */}
          <Pressable
            onPress={() => setShowHeoSil((v) => !v)}
            style={styles.accordionToggle}
            accessibilityRole="button"
          >
            <Text style={[styles.accordionLabel, { color: colors.textMuted }]}>
              {showHeoSil ? '▾  허/실 숨기기' : '▸  허/실 보기 (선택)'}
            </Text>
          </Pressable>

          {showHeoSil && (
            <PulseSliderRow
              leftLabel={'허(虛)'}
              rightLabel={'실(實)'}
              value={pulse.heoSil}
              onChange={(v) => setPulse((p) => ({ ...p, heoSil: v }))}
              onDragStart={() => setScrollEnabled(false)}
              onDragEnd={() => setScrollEnabled(true)}
            />
          )}
        </View>

        {/* Bottom padding so last section isn't flush against safe area */}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Proceed CTA */}
      <View style={[styles.ctaBar, { backgroundColor: colors.surface1, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleProceed}
          style={[styles.ctaButton, { backgroundColor: colors.accentFill }]}
          accessibilityRole="button"
          accessibilityLabel="AI 문진 시작"
        >
          <Text style={[styles.ctaText, { color: colors.accentText }]}>AI 문진 시작 →</Text>
        </Pressable>
      </View>

      {/* ④ Correction popover — Modal renders above ScrollView automatically */}
      <ChipCorrectionPopover
        visible={popover.visible}
        fieldLabel={popover.field?.label ?? ''}
        alternatives={popover.field?.alternatives ?? []}
        onSelect={handleCorrection}
        onTypeManually={handleCorrection}
        onDismiss={closePopover}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  // Patient info card
  infoCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  rowGap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    alignItems: 'flex-end',
  },
  fieldGroup: {
    gap: spacing[1],
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  numInput: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.base,
    minWidth: 72,
    height: 40,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  genderChip: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  bmiBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  smallChip: {
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  accordionToggle: {
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: 'center',
  },
  accordionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  bottomPad: {
    height: spacing[8],
  },
  ctaBar: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
  },
  ctaButton: {
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  ctaText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
});
