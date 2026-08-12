import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { useSession } from '../context/SessionContext';
import { useBodyMap } from '../hooks/useBodyMap';
import { BodyRegionGrid } from '../components/BodyRegionGrid';
import { BodySilhouette } from '../components/BodySilhouette';
import { PinPopover } from '../components/PinPopover';
import { SubMapOverlay } from '../components/SubMapOverlay';
import { PinListChips } from '../components/PinListChips';
import { HIT_REGIONS } from '../components/BodySilhouette';
import type { HitRegion } from '../components/BodySilhouette';
import type { BodyPin, SubMapType } from '../hooks/useBodyMap';
import type { RootStackParamList } from '../navigation/types';

type BodyMapRoute = RouteProp<RootStackParamList, 'BodyMap'>;

export function BodyMapScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { dispatch } = useSession();
  const route = useRoute<BodyMapRoute>();
  const preSelected = route.params?.preSelectedRegionId;

  const bodyMap = useBodyMap(preSelected);

  const [gridCollapsed, setGridCollapsed] = useState(!!preSelected);

  // Popover state
  const [popoverPin, setPopoverPin] = useState<BodyPin | null>(null);
  const [popoverVisible, setPopoverVisible] = useState(false);

  // Sub-map overlay state
  const [subMapType, setSubMapType] = useState<SubMapType | null>(null);
  const [subMapVisible, setSubMapVisible] = useState(false);

  // ── Region selection ──────────────────────────────────────────────────────

  const handleRegionSelect = useCallback(
    (id: string) => {
      bodyMap.setSelectedRegionId(id === bodyMap.selectedRegionId ? null : id);
    },
    [bodyMap],
  );

  // ── Side toggle ───────────────────────────────────────────────────────────

  const handleSideToggle = useCallback(
    (side: 'front' | 'back') => {
      bodyMap.setActiveSide(side);
    },
    [bodyMap],
  );

  // ── Silhouette tap → drop pin ─────────────────────────────────────────────

  const handleSilhouetteTap = useCallback(
    (svgX: number, svgY: number, region: HitRegion | null) => {
      const label = region?.label ?? '기타';
      const categoryId = region?.categoryId ?? bodyMap.selectedRegionId ?? '氣';

      bodyMap.addPin({
        x: svgX,
        y: svgY,
        side: bodyMap.activeSide,
        regionId: categoryId,
        svgRegionId: region?.id ?? 'unknown',
        label,
        painQualities: [],
        intensity: 5,
        subMapType: region?.subMapType,
      });

      // Auto-select region in tier 1
      if (region?.categoryId) {
        bodyMap.setSelectedRegionId(region.categoryId);
      }
    },
    [bodyMap],
  );

  // ── Pin press → open popover ──────────────────────────────────────────────

  const handlePinPress = useCallback((pin: BodyPin) => {
    setPopoverPin(pin);
    setPopoverVisible(true);
  }, []);

  // ── Pin long-press → sub-map overlay ─────────────────────────────────────

  const handlePinLongPress = useCallback((pin: BodyPin) => {
    if (pin.subMapType) {
      setSubMapType(pin.subMapType);
      setSubMapVisible(true);
    }
  }, []);

  // ── Popover callbacks ─────────────────────────────────────────────────────

  const handlePinUpdate = useCallback(
    (updates: Partial<Pick<BodyPin, 'painQualities' | 'intensity' | 'label'>>) => {
      if (popoverPin) bodyMap.updatePin(popoverPin.id, updates);
    },
    [popoverPin, bodyMap],
  );

  const handlePinRemoveFromPopover = useCallback(() => {
    if (popoverPin) bodyMap.removePin(popoverPin.id);
    setPopoverVisible(false);
    setPopoverPin(null);
  }, [popoverPin, bodyMap]);

  // ── Sub-map tap → add pin ─────────────────────────────────────────────────

  const handleSubMapTap = useCallback(
    (_x: number, _y: number, label: string) => {
      bodyMap.addPin({
        x: 100,
        y: 180,
        side: bodyMap.activeSide,
        regionId: bodyMap.selectedRegionId ?? '足',
        svgRegionId: 'submap',
        label,
        painQualities: [],
        intensity: 5,
      });
      setSubMapVisible(false);
    },
    [bodyMap],
  );

  // ── Pin list chip callbacks ───────────────────────────────────────────────

  const pinNumber = useCallback(
    (pin: BodyPin) => bodyMap.pins.indexOf(pin) + 1,
    [bodyMap.pins],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.surface0 }]}>
      {/* Tier 1 — category grid */}
      <BodyRegionGrid
        selectedId={bodyMap.selectedRegionId}
        collapsed={gridCollapsed}
        onToggleCollapse={() => setGridCollapsed((v) => !v)}
        onSelect={handleRegionSelect}
      />

      {/* Front / back toggle */}
      <View style={[styles.toggleRow, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
        {(['front', 'back'] as const).map((side) => {
          const active = bodyMap.activeSide === side;
          return (
            <Pressable
              key={side}
              onPress={() => handleSideToggle(side)}
              style={[
                styles.toggleBtn,
                active && { backgroundColor: colors.accentFill },
              ]}
              accessibilityRole="button"
              accessibilityLabel={side === 'front' ? '앞면' : '뒷면'}
            >
              <Text style={[styles.toggleText, { color: active ? colors.accentText : colors.textSecondary }]}>
                {side === 'front' ? '앞면' : '뒷면'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tier 2 — body silhouette */}
      <View style={[styles.silhouetteContainer, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
        <BodySilhouette
          side={bodyMap.activeSide}
          pins={bodyMap.pins}
          selectedRegionId={bodyMap.selectedRegionId}
          onTap={handleSilhouetteTap}
          onPinPress={handlePinPress}
          onPinLongPress={handlePinLongPress}
        />
      </View>

      {/* Pin list */}
      <PinListChips
        pins={bodyMap.pins}
        onPress={handlePinPress}
        onRemove={bodyMap.removePin}
      />

      {/* Pin popover */}
      <PinPopover
        visible={popoverVisible}
        pin={popoverPin}
        pinNumber={popoverPin ? pinNumber(popoverPin) : 0}
        onUpdate={handlePinUpdate}
        onRemove={handlePinRemoveFromPopover}
        onDismiss={() => setPopoverVisible(false)}
      />

      {/* Sub-map overlay */}
      <SubMapOverlay
        visible={subMapVisible}
        type={subMapType}
        onDismiss={() => setSubMapVisible(false)}
        onTap={handleSubMapTap}
      />

      {/* Proceed CTA */}
      <Pressable
        onPress={() => {
          dispatch({ type: 'SET_BODY_MAP_PINS', pins: bodyMap.pins });
          navigation.navigate('ClinicalReasoning');
        }}
        style={[styles.ctaButton, { backgroundColor: colors.accentFill }]}
        accessibilityRole="button"
        accessibilityLabel="변증 분석 시작"
      >
        <Text style={[styles.ctaText, { color: colors.accentText }]}>변증 분석 →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  silhouetteContainer: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  ctaButton: {
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  ctaText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
});
