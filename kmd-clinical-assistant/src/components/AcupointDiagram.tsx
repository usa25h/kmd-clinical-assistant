import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Ellipse, Path, Line, Circle } from 'react-native-svg';
import { useTheme, typography, spacing, radii } from '../theme';
import type { AcupointData } from '../data/acupoints';

const SVG_W = 200;
const SVG_H = 360;

interface AcupointDiagramProps {
  acupoint: AcupointData;
}

export function AcupointDiagram({ acupoint }: AcupointDiagramProps) {
  const colors = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const bodyStroke = colors.border;
  const bodyFill = colors.surface2;
  const isBack = acupoint.svgSide === 'back';

  // Normalize pin to [0..1] then to display percent for the overlay dot
  const pinXPct = acupoint.svgX / SVG_W;
  const pinYPct = acupoint.svgY / SVG_H;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      {/* Side label */}
      <View style={styles.sideRow}>
        <View style={[styles.sideBadge, { backgroundColor: colors.surface2 }]}>
          <Text style={[styles.sideText, { color: colors.textMuted }]}>
            {isBack ? '뒷면' : '앞면'}
          </Text>
        </View>
      </View>

      {/* SVG silhouette */}
      <View style={styles.svgWrapper}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet">
          {/* Head */}
          <Ellipse cx="100" cy="38" rx="26" ry="30" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
          {/* Neck */}
          <Path d="M89 66 L89 82 L111 82 L111 66 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
          {/* Torso */}
          <Path
            d="M68 80 Q60 90 58 140 L74 175 L126 175 L142 140 Q140 90 132 80 Z"
            fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"
          />
          {/* Left arm */}
          <Path
            d="M68 82 Q50 100 36 130 L32 240 L54 240 L70 135 Z"
            fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"
          />
          {/* Right arm */}
          <Path
            d="M132 82 Q150 100 164 130 L168 240 L146 240 L130 135 Z"
            fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5"
          />
          {/* Left leg */}
          <Path d="M74 175 L66 203 L66 355 L98 355 L98 203 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
          {/* Right leg */}
          <Path d="M126 175 L134 203 L134 355 L102 355 L102 203 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />

          {/* Reference lines */}
          {isBack ? (
            <Line x1="100" y1="82" x2="100" y2="200" stroke={bodyStroke} strokeWidth="0.8" strokeDasharray="4,3" />
          ) : (
            <Line x1="100" y1="82" x2="100" y2="175" stroke={bodyStroke} strokeWidth="0.8" strokeDasharray="3,3" />
          )}

          {/* Acupoint dot — rendered in SVG for accurate scaling */}
          <Circle
            cx={acupoint.svgX}
            cy={acupoint.svgY}
            r="7"
            fill={colors.accentFill}
            opacity={0.3}
          />
          <Circle
            cx={acupoint.svgX}
            cy={acupoint.svgY}
            r="4"
            fill={colors.accentFill}
          />
        </Svg>

        {/* Pulsing halo — positioned over the dot using percentage */}
        <Animated.View
          style={[
            styles.halo,
            {
              left: `${pinXPct * 100}%`,
              top: `${pinYPct * 100}%`,
              backgroundColor: colors.accentFill,
              opacity: pulseAnim,
            },
          ]}
          pointerEvents="none"
        />
      </View>

      {/* Point label below diagram */}
      <View style={styles.labelRow}>
        <View style={[styles.codePill, { backgroundColor: colors.accentSubtle }]}>
          <Text style={[styles.codeText, { color: colors.accentFill }]}>{acupoint.code}</Text>
        </View>
        <Text style={[styles.nameText, { color: colors.textPrimary }]}>{acupoint.korean}</Text>
        <Text style={[styles.hanjaText, { color: colors.textMuted }]}>{acupoint.hanja}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: spacing[4],
  },
  sideRow: {
    padding: spacing[3],
    alignItems: 'flex-end',
  },
  sideBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  sideText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  svgWrapper: {
    height: 260,
    alignSelf: 'center',
    width: '60%',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: -11,
    marginTop: -11,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  codePill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  codeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  nameText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  hanjaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
});
