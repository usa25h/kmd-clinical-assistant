import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import type { BodyPin, PainQuality } from '../hooks/useBodyMap';

const PAIN_QUALITY_LABELS: Record<PainQuality, string> = {
  throbbing: '욱신욱신',
  numb: '저림',
  dullAche: '둔한 통증',
  stabbing: '찌르는 듯',
};

const PAIN_QUALITIES: PainQuality[] = ['throbbing', 'numb', 'dullAche', 'stabbing'];

const INTENSITY_DOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function intensityColor(intensity: number, accentFill: string, warningFill: string, dangerFill: string): string {
  if (intensity <= 3) return warningFill;
  if (intensity <= 6) return accentFill;
  return dangerFill;
}

interface PinPopoverProps {
  visible: boolean;
  pin: BodyPin | null;
  pinNumber: number;
  onUpdate: (updates: Partial<Pick<BodyPin, 'painQualities' | 'intensity' | 'label'>>) => void;
  onRemove: () => void;
  onDismiss: () => void;
}

export function PinPopover({ visible, pin, pinNumber, onUpdate, onRemove, onDismiss }: PinPopoverProps) {
  const colors = useTheme();
  const [qualities, setQualities] = useState<PainQuality[]>([]);
  const [intensity, setIntensity] = useState(5);

  useEffect(() => {
    if (pin) {
      setQualities(pin.painQualities);
      setIntensity(pin.intensity);
    }
  }, [pin]);

  if (!pin) return null;

  const toggleQuality = (q: PainQuality) => {
    const next = qualities.includes(q) ? qualities.filter((x) => x !== q) : [...qualities, q];
    setQualities(next);
    onUpdate({ painQualities: next });
  };

  const setInt = (v: number) => {
    setIntensity(v);
    onUpdate({ intensity: v });
  };

  const dotColor = intensityColor(intensity, colors.accentFill, colors.warningFill, colors.dangerFill);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={[styles.card, { backgroundColor: colors.surface1, borderColor: colors.border }]} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.pinBadge, { backgroundColor: dotColor }]}>
              <Text style={[styles.pinBadgeNum, { color: '#fff' }]}>{pinNumber}</Text>
            </View>
            <Text style={[styles.regionLabel, { color: colors.textPrimary }]}>{pin.label}</Text>
            <Pressable onPress={onDismiss} style={styles.closeBtn} accessibilityLabel="닫기">
              <Text style={[styles.closeX, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          {/* Pain quality chips */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>통증 성질</Text>
          <View style={styles.chipRow}>
            {PAIN_QUALITIES.map((q) => {
              const sel = qualities.includes(q);
              return (
                <Pressable
                  key={q}
                  onPress={() => toggleQuality(q)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: sel ? colors.accentSubtle : colors.surface0,
                      borderColor: sel ? colors.accentFill : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: sel ? colors.accentFill : colors.textSecondary }]}>
                    {PAIN_QUALITY_LABELS[q]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Intensity dots */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            강도 {intensity}/10
          </Text>
          <View style={styles.dotRow}>
            {INTENSITY_DOTS.map((v) => (
              <Pressable
                key={v}
                onPress={() => setInt(v)}
                style={[
                  styles.dot,
                  {
                    backgroundColor: v <= intensity ? dotColor : colors.surface2,
                    borderColor: v <= intensity ? dotColor : colors.border,
                  },
                ]}
                accessibilityLabel={`강도 ${v}`}
              />
            ))}
          </View>

          {/* Actions */}
          <Pressable
            onPress={onRemove}
            style={[styles.removeBtn, { borderColor: colors.dangerFill }]}
            accessibilityRole="button"
          >
            <Text style={[styles.removeBtnText, { color: colors.dangerFill }]}>핀 제거</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[5],
    gap: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  pinBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadgeNum: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  regionLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  closeBtn: {
    padding: spacing[1],
  },
  closeX: {
    fontSize: typography.fontSize.md,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  dotRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  dot: {
    flex: 1,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  removeBtn: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
