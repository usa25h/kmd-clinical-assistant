import React, { useRef, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Svg, { Ellipse, Rect, Line, Circle, Path } from 'react-native-svg';
import { useTheme, palette } from '../theme';
import type { BodyPin, BodySide, SubMapType } from '../hooks/useBodyMap';

// SVG viewport
export const SVG_W = 200;
export const SVG_H = 360;

export interface HitRegion {
  id: string;
  label: string;
  categoryId: string;
  subMapType?: SubMapType;
  shape: 'ellipse' | 'rect';
  // ellipse
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  // rect
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export const HIT_REGIONS: HitRegion[] = [
  { id: 'head', label: '두부', categoryId: '首', subMapType: 'face', shape: 'ellipse', cx: 100, cy: 38, rx: 26, ry: 30 },
  { id: 'neck', label: '목', categoryId: '頸', shape: 'rect', x: 89, y: 66, w: 22, h: 16 },
  { id: 'chest', label: '흉부', categoryId: '胸', shape: 'rect', x: 68, y: 80, w: 64, h: 55 },
  { id: 'abdomen', label: '복부', categoryId: '腹', shape: 'rect', x: 72, y: 133, w: 56, h: 44 },
  { id: 'pelvis', label: '골반', categoryId: '腰', shape: 'rect', x: 74, y: 175, w: 52, h: 30 },
  { id: 'arm_left', label: '좌상지', categoryId: '足', subMapType: 'hand', shape: 'rect', x: 36, y: 80, w: 34, h: 160 },
  { id: 'arm_right', label: '우상지', categoryId: '足', subMapType: 'hand', shape: 'rect', x: 130, y: 80, w: 34, h: 160 },
  { id: 'leg_left', label: '좌하지', categoryId: '足', subMapType: 'foot', shape: 'rect', x: 66, y: 203, w: 32, h: 152 },
  { id: 'leg_right', label: '우하지', categoryId: '足', subMapType: 'foot', shape: 'rect', x: 102, y: 203, w: 32, h: 152 },
];

function hitTest(svgX: number, svgY: number): HitRegion | null {
  // Check from most specific (small) to largest
  for (const r of HIT_REGIONS) {
    if (r.shape === 'ellipse') {
      const dx = (svgX - r.cx!) / r.rx!;
      const dy = (svgY - r.cy!) / r.ry!;
      if (dx * dx + dy * dy <= 1) return r;
    } else {
      if (svgX >= r.x! && svgX <= r.x! + r.w! && svgY >= r.y! && svgY <= r.y! + r.h!) return r;
    }
  }
  return null;
}

function pinColor(intensity: number): string {
  if (intensity <= 3) return palette.warning500;
  if (intensity <= 6) return palette.warning600;
  return palette.danger500;
}

interface BodySilhouetteProps {
  side: BodySide;
  pins: BodyPin[];
  selectedRegionId: string | null;
  onTap: (svgX: number, svgY: number, region: HitRegion | null) => void;
  onPinPress: (pin: BodyPin) => void;
  onPinLongPress: (pin: BodyPin) => void;
}

export function BodySilhouette({
  side,
  pins,
  selectedRegionId,
  onTap,
  onPinPress,
  onPinLongPress,
}: BodySilhouetteProps) {
  const colors = useTheme();

  // Layout tracking
  const layoutRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const txAnim = useRef(new Animated.Value(0)).current;
  const tyAnim = useRef(new Animated.Value(0)).current;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height, x, y } = e.nativeEvent.layout;
    layoutRef.current = { width, height, x, y };
  }, []);

  // Animate zoom to region when selectedRegionId changes
  const prevRegionId = useRef<string | null>(null);
  if (prevRegionId.current !== selectedRegionId) {
    prevRegionId.current = selectedRegionId;
    const region = selectedRegionId
      ? HIT_REGIONS.find((r) => r.categoryId === selectedRegionId)
      : null;

    if (region && layoutRef.current.width > 0) {
      const { width: W, height: H } = layoutRef.current;
      const dpX = ((region.cx ?? (region.x! + region.w! / 2)) / SVG_W) * W;
      const dpY = ((region.cy ?? (region.y! + region.h! / 2)) / SVG_H) * H;
      const scale = 1.8;
      const tx = (W / 2 - dpX) * (scale - 1);
      const ty = (H / 2 - dpY) * (scale - 1);

      Animated.spring(scaleAnim, { toValue: scale, friction: 7, tension: 50, useNativeDriver: true }).start();
      Animated.spring(txAnim, { toValue: tx, friction: 7, tension: 50, useNativeDriver: true }).start();
      Animated.spring(tyAnim, { toValue: ty, friction: 7, tension: 50, useNativeDriver: true }).start();
    } else {
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
      Animated.spring(txAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }).start();
      Animated.spring(tyAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }).start();
    }
  }

  const handlePress = useCallback(
    (e: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { width: W, height: H } = layoutRef.current;
      if (!W || !H) return;
      const svgX = (e.nativeEvent.locationX / W) * SVG_W;
      const svgY = (e.nativeEvent.locationY / H) * SVG_H;
      const region = hitTest(svgX, svgY);
      onTap(svgX, svgY, region);
    },
    [onTap],
  );

  const sidePins = pins.filter((p) => p.side === side);

  const bodyStroke = colors.border;
  const bodyFill = colors.surface2;

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.animContainer,
          { transform: [{ scale: scaleAnim }, { translateX: txAnim }, { translateY: tyAnim }] },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handlePress} accessibilityLabel="신체 부위 선택">
          <Svg width="100%" height="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet">
            {/* Silhouette shapes */}
            {/* Head */}
            <Ellipse cx="100" cy="38" rx="26" ry="30" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
            {/* Neck */}
            <Rect x="89" y="66" width="22" height="16" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
            {/* Torso */}
            <Path
              d="M68 80 Q60 90 58 140 L74 175 L126 175 L142 140 Q140 90 132 80 Z"
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth="1.5"
            />
            {/* Left arm */}
            <Path
              d="M68 82 Q50 100 36 130 L32 240 L54 240 L70 135 Z"
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth="1.5"
            />
            {/* Right arm */}
            <Path
              d="M132 82 Q150 100 164 130 L168 240 L146 240 L130 135 Z"
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth="1.5"
            />
            {/* Left leg */}
            <Path
              d="M74 175 L66 203 L66 355 L98 355 L98 203 Z"
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth="1.5"
            />
            {/* Right leg */}
            <Path
              d="M126 175 L134 203 L134 355 L102 355 L102 203 Z"
              fill={bodyFill}
              stroke={bodyStroke}
              strokeWidth="1.5"
            />
            {/* Back detail — spine line (front: face details, back: spine) */}
            {side === 'front' ? (
              <>
                <Line x1="100" y1="82" x2="100" y2="175" stroke={bodyStroke} strokeWidth="0.8" strokeDasharray="3,3" />
              </>
            ) : (
              <Line x1="100" y1="82" x2="100" y2="200" stroke={bodyStroke} strokeWidth="1" strokeDasharray="4,3" />
            )}

            {/* Pins */}
            {sidePins.map((pin, i) => {
              const px = (pin.x / SVG_W) * SVG_W;
              const py = (pin.y / SVG_H) * SVG_H;
              const color = pinColor(pin.intensity);
              return (
                <React.Fragment key={pin.id}>
                  <Circle cx={px} cy={py} r="10" fill={color} opacity={0.9} />
                  {/* Number label handled in overlay Pressable below */}
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Pin number labels & press areas (rendered over SVG using absolute position) */}
          {sidePins.map((pin) => {
            const { width: W, height: H } = layoutRef.current;
            if (!W || !H) return null;
            const px = (pin.x / SVG_W) * W;
            const py = (pin.y / SVG_H) * H;
            const color = pinColor(pin.intensity);
            const num = pins.indexOf(pin) + 1;
            return (
              <Pressable
                key={pin.id}
                style={[styles.pinButton, { left: px - 14, top: py - 14, borderColor: color }]}
                onPress={() => onPinPress(pin)}
                onLongPress={() => onPinLongPress(pin)}
                accessibilityLabel={`핀 ${num} ${pin.label}`}
              >
                <Text style={[styles.pinNum, { color }]}>{num}</Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  animContainer: {
    flex: 1,
  },
  pinButton: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pinNum: {
    fontSize: 11,
    fontWeight: '500',
  },
});
