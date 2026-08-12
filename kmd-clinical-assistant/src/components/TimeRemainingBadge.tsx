import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';

interface TimeRemainingBadgeProps {
  seconds: number;
}

export function TimeRemainingBadge({ seconds }: TimeRemainingBadgeProps) {
  const colors = useTheme();
  const done = seconds <= 0;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: done ? colors.successSubtle : colors.accentSubtle,
          borderColor: done ? colors.successFill : colors.accentFill,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: done ? colors.successFill : colors.accentFill },
        ]}
      >
        {done ? '완료' : `~${seconds}s 남음`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    borderWidth: 1,
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
