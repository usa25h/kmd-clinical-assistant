/**
 * ChipCorrectionPopover — shared correction UI for every screen with editable chips.
 *
 * Shows 3 AI-suggested alternatives as selectable chips plus a "type manually" fallback.
 * Dismiss by tapping the backdrop or calling onDismiss().
 */
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { Chip } from './Chip';

export interface ChipCorrectionPopoverProps {
  visible: boolean;
  /** The current chip label being corrected */
  fieldLabel: string;
  /** Exactly 3 AI-suggested alternatives */
  alternatives: string[];
  /** Called when the user picks an alternative chip */
  onSelect: (label: string) => void;
  /** Called when the user confirms a free-text correction */
  onTypeManually: (text: string) => void;
  onDismiss: () => void;
}

export function ChipCorrectionPopover({
  visible,
  fieldLabel,
  alternatives,
  onSelect,
  onTypeManually,
  onDismiss,
}: ChipCorrectionPopoverProps) {
  const colors = useTheme();
  const [manualText, setManualText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const reset = () => {
    setManualText('');
    setShowInput(false);
  };

  const handleSelect = (label: string) => {
    onSelect(label);
    reset();
  };

  const handleConfirmManual = () => {
    const trimmed = manualText.trim();
    if (trimmed) {
      onTypeManually(trimmed);
      reset();
    }
  };

  const handleDismiss = () => {
    reset();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      {/* Backdrop: tapping it dismisses */}
      <Pressable style={styles.backdrop} onPress={handleDismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kvContainer}
        >
          {/* Card: inner Pressable absorbs touches so backdrop doesn't fire */}
          <Pressable
            onPress={() => {}}
            style={[
              styles.card,
              { backgroundColor: colors.surface1, borderColor: colors.border },
            ]}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerLabel, { color: colors.textMuted }]}>수정: </Text>
              <Text style={[styles.originalLabel, { color: colors.textPrimary }]}>
                "{fieldLabel}"
              </Text>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Alternative chips */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>추천 대안</Text>
            <View style={styles.altRow}>
              {alternatives.slice(0, 3).map((alt) => (
                <Chip key={alt} label={alt} variant="default" onPress={() => handleSelect(alt)} />
              ))}
            </View>

            {/* Manual input */}
            {showInput ? (
              <View style={styles.manualRow}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.surface2,
                    },
                  ]}
                  value={manualText}
                  onChangeText={setManualText}
                  placeholder="직접 입력"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleConfirmManual}
                />
                <Pressable
                  onPress={handleConfirmManual}
                  style={[styles.confirmBtn, { backgroundColor: colors.accentFill }]}
                >
                  <Text style={[styles.confirmBtnText, { color: colors.accentText }]}>확인</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setShowInput(true)} style={styles.manualFallback}>
                <Text style={[styles.manualFallbackText, { color: colors.textMuted }]}>
                  직접 입력…
                </Text>
              </Pressable>
            )}
          </Pressable>
        </KeyboardAvoidingView>
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
  },
  kvContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[5],
    gap: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  originalLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    flexShrink: 1,
  },
  divider: {
    height: 1,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  altRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  manualRow: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing[3],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
  },
  confirmBtn: {
    height: 44,
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  manualFallback: {
    paddingVertical: spacing[2],
    minHeight: 44,
    justifyContent: 'center',
  },
  manualFallbackText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});
