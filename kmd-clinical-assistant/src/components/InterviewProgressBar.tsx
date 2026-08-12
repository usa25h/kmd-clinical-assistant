import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';

interface InterviewProgressBarProps {
  currentIndex: number; // 0-based; equals total when complete
  total: number;
}

export function InterviewProgressBar({ currentIndex, total }: InterviewProgressBarProps) {
  const colors = useTheme();
  const displayIndex = Math.min(currentIndex, total);

  return (
    <View style={styles.container}>
      {/* Label row */}
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {displayIndex < total
            ? `Card ${displayIndex + 1} of ${total}`
            : '모든 질문 완료'}
        </Text>
        <Text style={[styles.fraction, { color: colors.textMuted }]}>
          {displayIndex}/{total}
        </Text>
      </View>

      {/* Segmented bar */}
      <View style={styles.bar}>
        {Array.from({ length: total }, (_, i) => {
          const isComplete = i < displayIndex;
          const isCurrent = i === displayIndex;
          return (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  backgroundColor: isComplete
                    ? colors.successFill
                    : isCurrent
                      ? colors.accentFill
                      : colors.surface2,
                  borderColor: isComplete
                    ? colors.successFill
                    : isCurrent
                      ? colors.accentFill
                      : colors.border,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  fraction: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  bar: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
});
