import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { WaveformBars } from './WaveformBars';

const MIC_SIZE = 80;

interface VoiceRecordingPanelProps {
  isRecording: boolean;
  liveTranscript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function VoiceRecordingPanel({
  isRecording,
  liveTranscript,
  onStartRecording,
  onStopRecording,
}: VoiceRecordingPanelProps) {
  const colors = useTheme();

  const handlePress = () => (isRecording ? onStopRecording() : onStartRecording());

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      {/* Waveform appears only while recording */}
      {isRecording && <WaveformBars active={isRecording} color={colors.dangerFill} />}

      {/* Mic / stop button */}
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={isRecording ? '녹음 중지' : '녹음 시작'}
        style={({ pressed }) => [
          styles.micButton,
          {
            backgroundColor: isRecording ? colors.dangerFill : colors.surface2,
            borderColor: isRecording ? colors.dangerFill : colors.border,
          },
          pressed && styles.pressed,
        ]}
      >
        {/* Icon: circle when idle, square when recording */}
        {isRecording ? (
          <View style={[styles.stopIcon, { backgroundColor: colors.dangerText }]} />
        ) : (
          <View style={[styles.recordIcon, { backgroundColor: colors.dangerFill }]} />
        )}
      </Pressable>

      {/* Status / transcript line */}
      {liveTranscript ? (
        <Text style={[styles.transcript, { color: colors.textSecondary }]}>{liveTranscript}</Text>
      ) : (
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {isRecording ? '듣고 있어요…' : '버튼을 눌러 증상을 말해주세요'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  micButton: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.95 }],
  },
  recordIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  stopIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  transcript: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
    lineHeight: typography.fontSize.sm * 1.55,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
  },
});
