import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme, typography, spacing, radii, palette } from '../theme';

export type ChipVariant = 'default' | 'selected' | 'low-confidence' | 'add-new';

interface ChipProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
}

const WARNING_ICON = '⚠';
const ADD_ICON = '+';

export function Chip({ label, variant = 'default', style, ...rest }: ChipProps) {
  const colors = useTheme();

  const containerStyle = [
    styles.base,
    variant === 'selected' && { backgroundColor: colors.accentFill, borderColor: colors.accentFill },
    variant === 'low-confidence' && { backgroundColor: colors.warningSubtle, borderColor: colors.warningFill },
    variant === 'add-new' && {
      backgroundColor: 'transparent',
      borderColor: colors.border,
      borderStyle: 'dashed' as const,
    },
    variant === 'default' && { backgroundColor: colors.surface2, borderColor: colors.border },
    style,
  ];

  const textColor =
    variant === 'selected'
      ? colors.accentText
      : variant === 'low-confidence'
        ? colors.warningText
        : colors.textPrimary;

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
      accessibilityRole="button"
      {...rest}
    >
      {variant === 'low-confidence' && (
        <Text style={[styles.icon, { color: colors.warningFill }]}>{WARNING_ICON}</Text>
      )}
      {variant === 'add-new' && (
        <Text style={[styles.icon, { color: colors.textMuted }]}>{ADD_ICON}</Text>
      )}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

// Separate "chip row" helper for convenience
interface ChipRowProps {
  chips: Array<{ id: string; label: string; variant?: ChipVariant }>;
  onPress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function ChipRow({ chips, onPress, style }: ChipRowProps) {
  return (
    <View style={[styles.row, style]}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          variant={chip.variant}
          onPress={() => onPress?.(chip.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing[1],
    fontWeight: typography.fontWeight.medium,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: 0,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
});
