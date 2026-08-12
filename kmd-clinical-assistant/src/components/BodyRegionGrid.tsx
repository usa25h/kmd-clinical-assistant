import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';

export interface BodyRegionCard {
  id: string;
  hanja: string;
  korean: string;
  keywords: string[];
}

export const BODY_REGION_CARDS: BodyRegionCard[] = [
  { id: '首', hanja: '首', korean: '두부', keywords: ['두통', '어지럼증', '안면'] },
  { id: '頸', hanja: '頸', korean: '목', keywords: ['경항통', '뻣뻣함', '고개'] },
  { id: '胸', hanja: '胸', korean: '흉부', keywords: ['가슴', '호흡', '심장'] },
  { id: '腹', hanja: '腹', korean: '복부', keywords: ['복통', '소화', '배변'] },
  { id: '腰', hanja: '腰', korean: '허리골반', keywords: ['요통', '골반통', '디스크'] },
  { id: '足', hanja: '足', korean: '수족하지', keywords: ['팔', '다리', '관절'] },
  { id: '面', hanja: '面', korean: '안면', keywords: ['안구', '구강', '비염'] },
  { id: '筋', hanja: '筋', korean: '피육맥근골', keywords: ['근육', '관절', '힘줄'] },
  { id: '陰', hanja: '陰', korean: '비뇨생식', keywords: ['배뇨', '생식기', '신장'] },
  { id: '氣', hanja: '氣', korean: '전신기혈', keywords: ['피로', '기혈', '전신'] },
  { id: '婦', hanja: '婦', korean: '부인과', keywords: ['월경', '불임', '갱년기'] },
  { id: '兒', hanja: '兒', korean: '소아과', keywords: ['성장', '발달', '소화'] },
];

interface BodyRegionGridProps {
  selectedId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (id: string) => void;
}

export function BodyRegionGrid({
  selectedId,
  collapsed,
  onToggleCollapse,
  onSelect,
}: BodyRegionGridProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface1 }]}>
      {/* Header row */}
      <Pressable
        onPress={onToggleCollapse}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={collapsed ? '부위 분류 펼치기' : '부위 분류 접기'}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>부위 분류</Text>
        {selectedId && (
          <View style={[styles.selectedBadge, { backgroundColor: colors.accentSubtle }]}>
            <Text style={[styles.selectedBadgeText, { color: colors.accentFill }]}>
              {BODY_REGION_CARDS.find((c) => c.id === selectedId)?.korean ?? selectedId}
            </Text>
          </View>
        )}
        <Text style={[styles.chevron, { color: colors.textMuted }]}>{collapsed ? '▾' : '▴'}</Text>
      </Pressable>

      {/* Grid */}
      {!collapsed && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.grid}>
            {BODY_REGION_CARDS.map((card) => {
              const isSelected = card.id === selectedId;
              return (
                <Pressable
                  key={card.id}
                  onPress={() => onSelect(card.id)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isSelected ? colors.accentSubtle : colors.surface0,
                      borderColor: isSelected ? colors.accentFill : colors.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${card.korean} 선택`}
                >
                  <Text style={[styles.hanja, { color: isSelected ? colors.accentFill : colors.textPrimary }]}>
                    {card.hanja}
                  </Text>
                  <Text style={[styles.korean, { color: isSelected ? colors.accentFill : colors.textSecondary }]}>
                    {card.korean}
                  </Text>
                  <Text style={[styles.keywords, { color: colors.textMuted }]} numberOfLines={1}>
                    {card.keywords.join(' ')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  headerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  selectedBadge: {
    flex: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    alignSelf: 'center',
  },
  selectedBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  chevron: {
    fontSize: typography.fontSize.sm,
  },
  scroll: {
    paddingBottom: spacing[3],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  card: {
    width: 72,
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing[2],
    alignItems: 'center',
    gap: 2,
  },
  hanja: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
  korean: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  keywords: {
    fontSize: 10,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
  },
});
