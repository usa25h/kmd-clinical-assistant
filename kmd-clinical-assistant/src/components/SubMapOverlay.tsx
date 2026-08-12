import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Ellipse, Rect, Path, Circle } from 'react-native-svg';
import { useTheme, typography, spacing, radii } from '../theme';
import type { SubMapType } from '../hooks/useBodyMap';

const SUB_MAP_LABELS: Record<SubMapType, string> = {
  hand: '손/손목 세부 지도',
  foot: '발/발목 세부 지도',
  face: '안면 세부 지도',
};

interface SubMapOverlayProps {
  visible: boolean;
  type: SubMapType | null;
  onDismiss: () => void;
  onTap: (svgX: number, svgY: number, label: string) => void;
}

function HandSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 120 200">
      {/* Palm */}
      <Rect x="30" y="90" width="60" height="80" rx="10" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Thumb */}
      <Rect x="10" y="105" width="24" height="40" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Index */}
      <Rect x="34" y="50" width="16" height="44" rx="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Middle */}
      <Rect x="52" y="40" width="16" height="54" rx="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Ring */}
      <Rect x="70" y="45" width="15" height="49" rx="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Pinky */}
      <Rect x="87" y="58" width="13" height="38" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Wrist */}
      <Rect x="35" y="168" width="50" height="28" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </Svg>
  );
}

function FootSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 140 220">
      {/* Heel */}
      <Ellipse cx="60" cy="185" rx="38" ry="30" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Arch / mid-foot */}
      <Rect x="22" y="100" width="76" height="95" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Toes row */}
      <Ellipse cx="38" cy="65" rx="10" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <Ellipse cx="58" cy="55" rx="10" ry="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <Ellipse cx="76" cy="58" rx="9" ry="20" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <Ellipse cx="92" cy="63" rx="8" ry="17" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <Ellipse cx="106" cy="70" rx="7" ry="14" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Ankle */}
      <Circle cx="30" cy="155" r="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <Circle cx="90" cy="155" r="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </Svg>
  );
}

function FaceSvg({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 160 200">
      {/* Head oval */}
      <Ellipse cx="80" cy="95" rx="68" ry="88" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Eyes */}
      <Ellipse cx="55" cy="80" rx="14" ry="9" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <Ellipse cx="105" cy="80" rx="14" ry="9" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {/* Nose */}
      <Path d="M74 100 Q80 120 86 100" fill="none" stroke={stroke} strokeWidth="1.2" />
      {/* Mouth */}
      <Path d="M60 135 Q80 148 100 135" fill="none" stroke={stroke} strokeWidth="1.5" />
      {/* Ears */}
      <Ellipse cx="13" cy="95" rx="11" ry="20" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <Ellipse cx="147" cy="95" rx="11" ry="20" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {/* Eyebrows */}
      <Path d="M42 68 Q55 62 68 68" fill="none" stroke={stroke} strokeWidth="1.5" />
      <Path d="M92 68 Q105 62 118 68" fill="none" stroke={stroke} strokeWidth="1.5" />
    </Svg>
  );
}

export function SubMapOverlay({ visible, type, onDismiss, onTap }: SubMapOverlayProps) {
  const colors = useTheme();

  if (!type) return null;

  const label = SUB_MAP_LABELS[type];

  const handlePress = (e: { nativeEvent: { locationX: number; locationY: number } }) => {
    onTap(e.nativeEvent.locationX, e.nativeEvent.locationY, label);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface1, borderColor: colors.border }]}
          onPress={() => {}}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{label}</Text>
            <Pressable onPress={onDismiss} accessibilityLabel="닫기">
              <Text style={[styles.closeX, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <Text style={[styles.hint, { color: colors.textMuted }]}>탭하면 이 위치에 핀이 추가됩니다</Text>

          <Pressable style={styles.svgContainer} onPress={handlePress} accessibilityLabel="세부 지도">
            {type === 'hand' && <HandSvg fill={colors.surface2} stroke={colors.border} />}
            {type === 'foot' && <FootSvg fill={colors.surface2} stroke={colors.border} />}
            {type === 'face' && <FaceSvg fill={colors.surface2} stroke={colors.border} />}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: spacing[5],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  closeX: {
    fontSize: typography.fontSize.md,
    padding: spacing[1],
  },
  hint: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  svgContainer: {
    height: 280,
  },
});
