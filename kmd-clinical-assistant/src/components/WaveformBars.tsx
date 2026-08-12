import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const NUM_BARS = 7;
const BAR_WIDTH = 4;
const BAR_GAP = 5;
const MAX_HEIGHT = 44;
const MIN_HEIGHT = 5;

// Each bar oscillates at a slightly different speed for a natural look
const BAR_HALF_DURATIONS = [170, 140, 210, 130, 190, 155, 185];

interface WaveformBarsProps {
  active: boolean;
  color?: string;
}

export function WaveformBars({ active, color }: WaveformBarsProps) {
  const colors = useTheme();
  const barColor = color ?? colors.dangerFill;

  // Stable animated values initialized once on mount
  const barAnims = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(MIN_HEIGHT)),
  ).current;

  // Peak heights randomized once per recording session
  const peakHeights = useRef<number[]>([]);

  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    loopsRef.current.forEach((l) => l.stop());
    loopsRef.current = [];

    if (!active) {
      barAnims.forEach((anim) =>
        Animated.timing(anim, { toValue: MIN_HEIGHT, duration: 180, useNativeDriver: false }).start(),
      );
      return;
    }

    // Randomize peak heights each recording session
    peakHeights.current = barAnims.map(() => MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT));

    const loops = barAnims.map((anim, i) => {
      const peak = peakHeights.current[i];
      const trough = MIN_HEIGHT + Math.random() * 10;
      const halfDur = BAR_HALF_DURATIONS[i];

      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: peak, duration: halfDur, useNativeDriver: false }),
          Animated.timing(anim, { toValue: trough, duration: halfDur, useNativeDriver: false }),
        ]),
      );
      loop.start();
      return loop;
    });

    loopsRef.current = loops;
    return () => loops.forEach((l) => l.stop());
  }, [active]);

  return (
    <View style={styles.container}>
      {barAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[styles.bar, { backgroundColor: barColor, width: BAR_WIDTH, height: anim }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_HEIGHT + 8,
    gap: BAR_GAP,
  },
  bar: {
    borderRadius: 3,
  },
});
