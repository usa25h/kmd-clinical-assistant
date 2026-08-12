import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';

const MIN_VALUE = -2;
const MAX_VALUE = 2;
const RANGE = MAX_VALUE - MIN_VALUE; // 4
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

function clamp(v: number): number {
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, v));
}

interface PulseSliderRowProps {
  leftLabel: string;
  rightLabel: string;
  value: number; // -2 … +2
  onChange: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function PulseSliderRow({
  leftLabel,
  rightLabel,
  value,
  onChange,
  onDragStart,
  onDragEnd,
}: PulseSliderRowProps) {
  const colors = useTheme();

  // Keep latest values in refs so PanResponder closure always sees them
  const valueRef = useRef(value);
  valueRef.current = value;
  const startValueRef = useRef(0);
  const trackWidthRef = useRef(1); // default 1 to avoid ÷0

  // Stable callback refs
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValueRef.current = valueRef.current;
        onDragStartRef.current?.();
      },
      onPanResponderMove: (_, gs) => {
        const delta = (gs.dx / trackWidthRef.current) * RANGE;
        onChangeRef.current(clamp(startValueRef.current + delta));
      },
      onPanResponderRelease: () => {
        onDragEndRef.current?.();
      },
      onPanResponderTerminate: () => {
        onDragEndRef.current?.();
      },
    }),
  ).current;

  // Track width is known only after layout; trigger re-render to position thumb
  const [trackWidth, setTrackWidth] = useState(0);

  const thumbX = ((value - MIN_VALUE) / RANGE) * trackWidth;
  const centerX = trackWidth / 2;
  const fillLeft = Math.min(thumbX, centerX);
  const fillWidth = Math.abs(thumbX - centerX);

  return (
    <View style={styles.row}>
      {/* Left label */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>{leftLabel}</Text>

      {/* Track area */}
      <View
        style={styles.trackWrapper}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          trackWidthRef.current = w;
          setTrackWidth(w);
        }}
      >
        {/* Base track */}
        <View
          style={[
            styles.track,
            { backgroundColor: colors.border, top: (THUMB_SIZE + 8 - TRACK_HEIGHT) / 2 },
          ]}
        />

        {/* Center tick */}
        <View
          style={[
            styles.centerTick,
            {
              left: centerX - 1,
              backgroundColor: colors.borderStrong,
              top: (THUMB_SIZE + 8 - 12) / 2,
            },
          ]}
        />

        {/* Colored fill from center to thumb */}
        {trackWidth > 0 && (
          <View
            style={[
              styles.fill,
              {
                left: fillLeft,
                width: fillWidth,
                backgroundColor: colors.accentFill,
                top: (THUMB_SIZE + 8 - TRACK_HEIGHT) / 2,
              },
            ]}
          />
        )}

        {/* Draggable thumb */}
        {trackWidth > 0 && (
          <View
            style={[
              styles.thumb,
              {
                left: thumbX - THUMB_SIZE / 2,
                top: 4,
                backgroundColor: colors.surface0,
                borderColor: colors.accentFill,
              },
            ]}
            {...panResponder.panHandlers}
          />
        )}
      </View>

      {/* Right label */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>{rightLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  label: {
    width: 40,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  trackWrapper: {
    flex: 1,
    height: THUMB_SIZE + 8,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  centerTick: {
    position: 'absolute',
    width: 2,
    height: 12,
    borderRadius: radii.sm,
  },
  fill: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
});
