import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { SwipeableCard } from './SwipeableCard';
import type { InterviewCard } from '../hooks/useAIInterview';
import type { STTField } from '../hooks/useSTT';

const PEEK_SCALE = 0.96;
const PEEK_TRANSLATE_Y = 10;

interface CardStackProps {
  cards: InterviewCard[];
  currentIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onChipSelect: (option: string) => void;
  isRecording: boolean;
  liveTranscript: string;
  spokenChips: STTField[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpokenChipPress: (field: STTField) => void;
}

export function CardStack({
  cards,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onChipSelect,
  isRecording,
  liveTranscript,
  spokenChips,
  onStartRecording,
  onStopRecording,
  onSpokenChipPress,
}: CardStackProps) {
  const colors = useTheme();
  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  // Spring animation: new active card "grows" from peek size to full
  const promoteAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    promoteAnim.setValue(PEEK_SCALE);
    Animated.spring(promoteAnim, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  // Complete state
  if (!currentCard) {
    return (
      <View style={[styles.completeContainer, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
        <Text style={[styles.completeEmoji]}>✓</Text>
        <Text style={[styles.completeTitle, { color: colors.successFill }]}>모든 질문 완료</Text>
        <Text style={[styles.completeBody, { color: colors.textSecondary }]}>
          답변이 저장됐습니다. 임상 추론 화면으로 이동해 주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {/* ── Peek card (rendered first = lower z-index) ───────────────────── */}
      {nextCard && (
        <View
          style={[
            styles.peekCard,
            {
              backgroundColor: colors.surface1,
              borderColor: colors.border,
              transform: [{ scale: PEEK_SCALE }, { translateY: PEEK_TRANSLATE_Y }],
            },
          ]}
          pointerEvents="none"
        >
          {/* Show only the question text in the peek card */}
          <Text style={[styles.peekQuestion, { color: colors.textSecondary }]}>
            {nextCard.question}
          </Text>
        </View>
      )}

      {/* ── Active card with promote animation ───────────────────────────── */}
      <Animated.View style={[styles.activeCard, { transform: [{ scale: promoteAnim }] }]}>
        <SwipeableCard
          key={currentCard.id}
          card={currentCard}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          onChipSelect={onChipSelect}
          isRecording={isRecording}
          liveTranscript={liveTranscript}
          spokenChips={spokenChips}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onSpokenChipPress={onSpokenChipPress}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    position: 'relative',
  },
  peekCard: {
    position: 'absolute',
    top: 0,
    left: spacing[2],
    right: spacing[2],
    bottom: -PEEK_TRANSLATE_Y,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[5],
    opacity: 0.65,
    justifyContent: 'center',
  },
  peekQuestion: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  activeCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  completeContainer: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[8],
  },
  completeEmoji: {
    fontSize: 40,
    color: '#22c55e',
  },
  completeTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
  },
  completeBody: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.5,
  },
});
