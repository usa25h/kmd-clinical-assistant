import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { Chip, ChipRow } from './Chip';
import { WaveformBars } from './WaveformBars';
import type { InterviewCard } from '../hooks/useAIInterview';
import type { STTField } from '../hooks/useSTT';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 0.35;
const MAX_ROTATE_DEG = 14;

interface SwipeableCardProps {
  card: InterviewCard;
  /** Only called for 'yes-no' cards */
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  /** Only called for 'chips' cards */
  onChipSelect: (option: string) => void;
  /** Voice input state passed from the parent screen */
  isRecording: boolean;
  liveTranscript: string;
  spokenChips: STTField[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpokenChipPress: (field: STTField) => void;
}

export function SwipeableCard({
  card,
  onSwipeLeft,
  onSwipeRight,
  onChipSelect,
  isRecording,
  liveTranscript,
  spokenChips,
  onStartRecording,
  onStopRecording,
  onSpokenChipPress,
}: SwipeableCardProps) {
  const colors = useTheme();
  const isYesNo = card.type === 'yes-no';

  // ── Stable callback refs (PanResponder closure won't stale) ────────────────
  const onSwipeLeftRef = useRef(onSwipeLeft);
  onSwipeLeftRef.current = onSwipeLeft;
  const onSwipeRightRef = useRef(onSwipeRight);
  onSwipeRightRef.current = onSwipeRight;

  // ── Animated values ────────────────────────────────────────────────────────
  const pan = useRef(new Animated.ValueXY()).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [`-${MAX_ROTATE_DEG}deg`, '0deg', `${MAX_ROTATE_DEG}deg`],
    extrapolate: 'clamp',
  });

  // Directional label opacity: fade in as card is dragged
  const noOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });
  const yesOpacity = pan.x.interpolate({
    inputRange: [0, 20, SWIPE_THRESHOLD],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  // ── PanResponder ───────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      // Swipe is only enabled for yes-no cards
      onStartShouldSetPanResponder: () => isYesNo,
      onMoveShouldSetPanResponder: (_, gs) =>
        isYesNo && Math.abs(gs.dx) > Math.abs(gs.dy),

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gs) => {
        const far = Math.abs(gs.dx) > SWIPE_THRESHOLD;
        const fast = Math.abs(gs.vx) > VELOCITY_THRESHOLD;

        if (far || fast) {
          const dir = gs.dx > 0 ? 1 : -1;
          Animated.timing(pan, {
            toValue: { x: dir * SCREEN_WIDTH * 1.5, y: gs.dy * 1.2 },
            duration: 240,
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished) {
              dir > 0 ? onSwipeRightRef.current() : onSwipeLeftRef.current();
            }
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface1,
          borderColor: colors.border,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Question */}
      <View style={styles.questionBlock}>
        <Text style={[styles.question, { color: colors.textPrimary }]}>{card.question}</Text>
        {card.hint && (
          <Text style={[styles.hint, { color: colors.textMuted }]}>{card.hint}</Text>
        )}
      </View>

      {/* Voice input row */}
      <View style={[styles.voiceRow, { borderColor: colors.border, backgroundColor: colors.surface2 }]}>
        <Pressable
          onPress={() => (isRecording ? onStopRecording() : onStartRecording())}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? '녹음 중지' : '음성 입력'}
          style={[
            styles.miniMic,
            { backgroundColor: isRecording ? colors.dangerFill : colors.surface0, borderColor: isRecording ? colors.dangerFill : colors.border },
          ]}
        >
          {isRecording
            ? <View style={[styles.stopDot, { backgroundColor: colors.dangerText }]} />
            : <View style={[styles.recDot, { backgroundColor: colors.dangerFill }]} />
          }
        </Pressable>

        {isRecording ? (
          <WaveformBars active={isRecording} color={colors.dangerFill} />
        ) : (
          <Text style={[styles.voiceHint, { color: colors.textMuted }]}>
            {liveTranscript || '말하거나 아래 칩을 선택해 주세요'}
          </Text>
        )}
      </View>

      {/* Spoken chips from voice recognition */}
      {spokenChips.length > 0 && (
        <View style={styles.spokenChipRow}>
          {spokenChips.map((f) => (
            <Chip
              key={f.id}
              label={f.confidence < 0.7 ? `${f.label} (오인식?)` : f.label}
              variant={f.confidence < 0.7 ? 'low-confidence' : 'selected'}
              onPress={() => onSpokenChipPress(f)}
            />
          ))}
        </View>
      )}

      {/* Preset option chips — only for chip-type cards */}
      {card.type === 'chips' && card.options && (
        <ChipRow
          chips={card.options.map((o) => ({ id: o, label: o }))}
          onPress={onChipSelect}
          style={styles.optionChips}
        />
      )}

      {/* Footer: directional signifiers or chip instruction */}
      <View style={styles.footer}>
        {isYesNo ? (
          <>
            <Animated.View style={[styles.dirLabel, styles.dirLeft, { opacity: noOpacity }]}>
              <Text style={[styles.dirArrow, { color: colors.dangerFill }]}>← </Text>
              <Text style={[styles.dirText, { color: colors.dangerFill }]}>아니오</Text>
            </Animated.View>

            <Animated.View style={[styles.dirLabel, styles.dirRight, { opacity: yesOpacity }]}>
              <Text style={[styles.dirText, { color: colors.successFill }]}>예</Text>
              <Text style={[styles.dirArrow, { color: colors.successFill }]}> →</Text>
            </Animated.View>
          </>
        ) : (
          <Text style={[styles.chipInstruction, { color: colors.textMuted }]}>
            칩을 선택하면 다음으로 넘어갑니다
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[5],
    gap: spacing[4],
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  questionBlock: {
    gap: spacing[2],
  },
  question: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.lg * 1.4,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    minHeight: 52,
  },
  miniMic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  recDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  voiceHint: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  spokenChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  optionChips: {
    // ChipRow already handles wrapping
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 36,
    marginTop: 'auto',
  },
  dirLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dirLeft: {},
  dirRight: {},
  dirArrow: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  dirText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  chipInstruction: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});
