import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { useAIInterview } from '../hooks/useAIInterview';
import { useSTT } from '../hooks/useSTT';
import type { STTField } from '../hooks/useSTT';
import {
  InterviewProgressBar,
  AnswerSummaryTray,
  CardStack,
  ChipCorrectionPopover,
} from '../components';
import { useSession } from '../context/SessionContext';
import type { RootStackParamList } from '../navigation/types';

export function AIInterviewScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dispatch } = useSession();
  const interview = useAIInterview();
  const stt = useSTT();

  // Spoken chips accumulated on the current card
  const [cardChips, setCardChips] = useState<STTField[]>([]);

  // Correction popover for spoken chips
  const [popover, setPopover] = useState<{ visible: boolean; field: STTField | null }>({
    visible: false,
    field: null,
  });

  // Reset STT state when the card changes
  useEffect(() => {
    stt.stopRecording();
    setCardChips([]);
  }, [interview.currentIndex]);

  // Accumulate STT-extracted fields as editable chips on the current card
  useEffect(() => {
    if (stt.extractedFields.length > 0) {
      setCardChips(stt.extractedFields);
    }
  }, [stt.extractedFields]);

  // ── Navigation handlers ─────────────────────────────────────────────────────

  const handleSwipeRight = useCallback(() => {
    interview.advance('yes', cardChips);
  }, [interview, cardChips]);

  const handleSwipeLeft = useCallback(() => {
    interview.advance('no', cardChips);
  }, [interview, cardChips]);

  const handleChipSelect = useCallback(
    (option: string) => {
      interview.advance(option, cardChips);
    },
    [interview, cardChips],
  );

  const handleGoTo = useCallback(
    (index: number) => {
      interview.goTo(index);
    },
    [interview],
  );

  // ── Spoken chip correction ──────────────────────────────────────────────────

  const openPopover = useCallback((field: STTField) => {
    setPopover({ visible: true, field });
  }, []);

  const closePopover = useCallback(() => {
    setPopover({ visible: false, field: null });
  }, []);

  const handleCorrection = useCallback(
    (newLabel: string) => {
      if (!popover.field) { closePopover(); return; }
      const field = popover.field;

      // Update live card chips
      setCardChips((prev) =>
        prev.map((f) => (f.id === field.id ? { ...f, label: newLabel, confidence: 1 } : f)),
      );

      // Also correct in already-saved answers (if the card was previously answered and re-visited)
      const currentCard = interview.cards[interview.currentIndex];
      if (currentCard) {
        interview.correctSpokenChip(currentCard.id, field.id, newLabel);
      }

      closePopover();
    },
    [popover.field, interview, closePopover],
  );

  const handleProceedToBodyMap = useCallback(() => {
    dispatch({ type: 'SET_INTERVIEW_ANSWERS', answers: interview.answers });
    navigation.navigate('BodyMap');
  }, [dispatch, interview.answers, navigation]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { backgroundColor: colors.surface0 }]}>
      <View style={styles.content}>
        {/* ① Progress bar */}
        <InterviewProgressBar
          currentIndex={interview.currentIndex}
          total={interview.cards.length}
        />

        {/* ② Collapsed answer summary tray */}
        <AnswerSummaryTray
          answers={interview.answers}
          cards={interview.cards}
          onTapAnswer={handleGoTo}
        />

        {/* ③ Card stack */}
        <CardStack
          cards={interview.cards}
          currentIndex={interview.currentIndex}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onChipSelect={handleChipSelect}
          isRecording={stt.isRecording}
          liveTranscript={stt.liveTranscript}
          spokenChips={cardChips}
          onStartRecording={stt.startRecording}
          onStopRecording={stt.stopRecording}
          onSpokenChipPress={openPopover}
        />
      </View>

      {/* ④ Chip correction popover (shared component from Step 1) */}
      <ChipCorrectionPopover
        visible={popover.visible}
        fieldLabel={popover.field?.label ?? ''}
        alternatives={popover.field?.alternatives ?? []}
        onSelect={handleCorrection}
        onTypeManually={handleCorrection}
        onDismiss={closePopover}
      />

      {/* Proceed CTA — visible when all questions answered */}
      {interview.isComplete && (
        <View style={[styles.ctaBar, { backgroundColor: colors.surface1, borderTopColor: colors.border }]}>
          <Text style={[styles.ctaHint, { color: colors.textMuted }]}>문진 완료 — 통증 부위를 표시하세요</Text>
          <Pressable
            onPress={handleProceedToBodyMap}
            style={[styles.ctaButton, { backgroundColor: colors.accentFill }]}
            accessibilityRole="button"
            accessibilityLabel="바디맵으로 이동"
          >
            <Text style={[styles.ctaText, { color: colors.accentText }]}>바디맵 →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[4],
  },
  ctaBar: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    gap: spacing[2],
  },
  ctaHint: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
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
