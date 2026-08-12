import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii, palette } from '../theme';
import type { BodyPin } from '../hooks/useBodyMap';

function pinColor(intensity: number): string {
  if (intensity <= 3) return palette.warning500;
  if (intensity <= 6) return palette.warning600;
  return palette.danger500;
}

interface PinListChipsProps {
  pins: BodyPin[];
  onPress: (pin: BodyPin) => void;
  onRemove: (id: string) => void;
}

export function PinListChips({ pins, onPress, onRemove }: PinListChipsProps) {
  const colors = useTheme();

  if (pins.length === 0) {
    return (
      <View style={[styles.emptyRow, { borderColor: colors.border }]}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          지도를 탭해서 통증 부위를 표시하세요
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {pins.map((pin, i) => {
        const color = pinColor(pin.intensity);
        return (
          <Pressable
            key={pin.id}
            onPress={() => onPress(pin)}
            style={[styles.chip, { borderColor: color, backgroundColor: colors.surface1 }]}
            accessibilityLabel={`핀 ${i + 1} ${pin.label} 편집`}
          >
            <View style={[styles.numBadge, { backgroundColor: color }]}>
              <Text style={styles.numText}>{i + 1}</Text>
            </View>
            <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>
              {pin.label}
            </Text>
            <Text style={[styles.intensity, { color }]}>{pin.intensity}/10</Text>
            <Pressable
              onPress={() => onRemove(pin.id)}
              style={styles.removeBtn}
              hitSlop={8}
              accessibilityLabel="핀 제거"
            >
              <Text style={[styles.removeX, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[1],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderRadius: radii.full,
    paddingLeft: spacing[1],
    paddingRight: spacing[3],
    paddingVertical: spacing[1],
    minHeight: 44,
  },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: '#fff',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    maxWidth: 80,
  },
  intensity: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  removeBtn: {
    marginLeft: spacing[1],
  },
  removeX: {
    fontSize: 12,
  },
  emptyRow: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});
