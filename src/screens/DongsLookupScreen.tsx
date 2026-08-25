import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { DONGS_POINTS, type DongsPoint } from '../data/dongs';
import type { RootStackParamList } from '../navigation/types';

// Group points by zone
function groupByZone(points: DongsPoint[]): Map<string, DongsPoint[]> {
  const map = new Map<string, DongsPoint[]>();
  for (const pt of points) {
    const group = map.get(pt.zone) ?? [];
    group.push(pt);
    map.set(pt.zone, group);
  }
  return map;
}

// ── Point card ────────────────────────────────────────────────────────────────

function DongsPointCard({ point }: { point: DongsPoint & { note?: string } }) {
  const colors = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface1, borderColor: colors.border }]}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
      accessibilityLabel={`동씨침 ${point.korean} 자세히 보기`}
    >
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={[styles.codeChip, { backgroundColor: colors.accentSubtle }]}>
          <Text style={[styles.codeText, { color: colors.accentFill }]}>{point.code}</Text>
        </View>
        <View style={styles.cardNames}>
          <Text style={[styles.koreanName, { color: colors.textPrimary }]}>{point.korean}</Text>
          <Text style={[styles.hanjaName, { color: colors.textMuted }]}>{point.hanja}</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.textMuted }]}>
          {expanded ? '▾' : '▸'}
        </Text>
      </View>

      {/* Location summary */}
      <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 2}>
        {point.location}
      </Text>

      {/* Indication chips */}
      <View style={styles.chipRow}>
        {point.indications.slice(0, expanded ? undefined : 4).map((ind) => (
          <View key={ind} style={[styles.indChip, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
            <Text style={[styles.indText, { color: colors.textSecondary }]}>{ind}</Text>
          </View>
        ))}
        {!expanded && point.indications.length > 4 && (
          <Text style={[styles.moreText, { color: colors.textMuted }]}>+{point.indications.length - 4}</Text>
        )}
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View style={styles.expandedBody}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailGrid}>
            <DetailRow label="구역" value={`${point.zone} — ${point.zoneKorean}`} colors={colors} />
            <DetailRow label="자침 깊이" value={point.depth} colors={colors} />
            <DetailRow label="자침 방향" value={point.angle} colors={colors} />
            <DetailRow label="득기감" value={point.sensation} colors={colors} />
            {point.paired && (
              <DetailRow label="배혈(倂刺)" value={point.paired} colors={colors} />
            )}
          </View>

          {point.cautions && (
            <View style={[styles.cautionBox, { backgroundColor: '#FFF1F0', borderColor: '#FFA39E' }]}>
              <Text style={[styles.cautionText, { color: '#CF1322' }]}>{'⚠ '}{point.cautions}</Text>
            </View>
          )}

          {(point as any).note && (
            <Text style={[styles.noteText, { color: colors.textMuted }]}>
              {'※ '}{(point as any).note}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function DongsLookupScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const filtered = DONGS_POINTS.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      p.korean.includes(q) ||
      p.hanja.includes(q) ||
      p.zoneKorean.includes(q) ||
      p.location.includes(q) ||
      p.indications.some((i) => i.includes(q))
    );
  });

  const grouped = groupByZone(filtered);

  return (
    <View style={[styles.flex, { backgroundColor: colors.surface0 }]}>
      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface1, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="혈명, 구역, 적응증 검색…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info header */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            동경창(董景昌, 1916–1975) 선생이 창안한 침법. 표준 경혈계와 별개의 독자적
            혈위 체계를 사용하며, 전통적 대응(對應) 이론에 기반합니다.
            영골(22.08)·대백(22.09) 조합과 통관·통산·통천(88.01–03) 삼혈 조합이
            특히 임상에서 자주 활용됩니다.
          </Text>
        </View>

        <Pressable
          style={[styles.archiveLink, { borderColor: colors.accentFill }]}
          onPress={() => navigation.navigate('DongsArchive')}
          accessibilityRole="button"
          accessibilityLabel="동씨침 원문 자료 전체 보기"
        >
          <Text style={[styles.archiveLinkText, { color: colors.accentFill }]}>
            원문 자료 전체 검색 (349개) →
          </Text>
        </Pressable>

        {filtered.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            '{query}' 검색 결과 없음
          </Text>
        ) : (
          Array.from(grouped.entries()).map(([zone, points]) => (
            <View key={zone} style={styles.zoneSection}>
              <Text style={[styles.zoneLabel, { color: colors.textMuted }]}>
                {zone} — {points[0].zoneKorean}
              </Text>
              {points.map((p) => (
                <DongsPointCard key={p.code} point={p} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  searchBar: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
  },
  searchInput: {
    fontSize: typography.fontSize.base,
    minHeight: 40,
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[10],
  },
  infoBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[3],
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.7,
  },
  archiveLink: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: spacing[3],
    alignItems: 'center',
  },
  archiveLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  zoneSection: {
    gap: spacing[2],
  },
  zoneLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing[2],
  },
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  codeChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
    minWidth: 52,
    alignItems: 'center',
  },
  codeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  cardNames: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  koreanName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  hanjaName: {
    fontSize: typography.fontSize.sm,
  },
  chevron: {
    fontSize: typography.fontSize.lg,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    alignItems: 'center',
  },
  indChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  indText: {
    fontSize: typography.fontSize.xs,
  },
  moreText: {
    fontSize: typography.fontSize.xs,
    paddingHorizontal: spacing[1],
  },
  expandedBody: {
    gap: spacing[3],
  },
  divider: {
    height: 1,
  },
  detailGrid: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    width: 80,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    flex: 1,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  cautionBox: {
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing[3],
  },
  cautionText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  noteText: {
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    lineHeight: typography.fontSize.xs * 1.6,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    marginTop: spacing[8],
  },
});
