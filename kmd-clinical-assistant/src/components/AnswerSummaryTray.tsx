import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import type { InterviewCard, CardAnswer } from '../hooks/useAIInterview';

interface AnswerSummaryTrayProps {
  answers: CardAnswer[];
  cards: InterviewCard[];
  /** Called with the 0-based card index when the user taps a summary chip */
  onTapAnswer: (index: number) => void;
}

function summaryLabel(card: InterviewCard, answer: CardAnswer): string {
  // Shorten the question to ~4 chars max
  const shortQ = card.question.slice(0, 4);
  const val =
    answer.value === 'yes' ? '예' : answer.value === 'no' ? '아니오' : answer.value;
  return `${shortQ}… · ${val}`;
}

export function AnswerSummaryTray({ answers, cards, onTapAnswer }: AnswerSummaryTrayProps) {
  const colors = useTheme();

  if (answers.length === 0) return null;

  return (
    <View style={[styles.tray, { borderColor: colors.border }]}>
      <Text style={[styles.trayLabel, { color: colors.textMuted }]}>이전 답변</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {answers.map((answer) => {
          const cardIndex = cards.findIndex((c) => c.id === answer.cardId);
          const card = cards[cardIndex];
          if (!card) return null;

          return (
            <Pressable
              key={answer.cardId}
              onPress={() => onTapAnswer(cardIndex)}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: colors.surface2,
                  borderColor: colors.border,
                },
                pressed && styles.pillPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${card.question}의 답변 수정`}
            >
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                {summaryLabel(card, answer)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    gap: spacing[2],
    paddingBottom: spacing[1],
    borderBottomWidth: 1,
  },
  trayLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  scroll: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingRight: spacing[2],
  },
  pill: {
    height: 30,
    paddingHorizontal: spacing[3],
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: 'center',
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
});
