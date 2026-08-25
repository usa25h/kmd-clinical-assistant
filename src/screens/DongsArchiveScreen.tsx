import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import dongsArchiveData from '../data/dongsArchive.json';

// ── Data ──────────────────────────────────────────────────────────────────────
// Raw extraction from the user's own reference material (원문 자료). Unlike
// `dongs.ts` this is NOT hand-curated — some entries are OCR/parsing artifacts
// rather than real acupoint names, so this screen is browse/search-only and is
// never auto-matched against AI-generated free text (that would false-positive
// on ordinary Korean words).

export interface DongsArchiveEntry {
  id: string;
  name: string;
  photo_type: string;
  location: string;
  effect: string;
}

const ARCHIVE: DongsArchiveEntry[] = dongsArchiveData as DongsArchiveEntry[];

const PHOTO_TYPE_LABEL: Record<string, string> = {
  hand_finger: '손가락',
  hand_back: '손등',
  forearm: '전완(아래팔)',
  upper_arm: '상완(위팔)',
  foot_toe: '발가락',
  lower_leg: '하퇴(종아리)',
  thigh: '대퇴(허벅지)',
  ear: '귀',
  head_face: '두면부',
  back: '등',
  chest_abdomen: '흉복부',
};

function groupByPhotoType(entries: DongsArchiveEntry[]): Map<string, DongsArchiveEntry[]> {
  const map = new Map<string, DongsArchiveEntry[]>();
  for (const e of entries) {
    const group = map.get(e.photo_type) ?? [];
    group.push(e);
    map.set(e.photo_type, group);
  }
  return map;
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ArchiveEntryCard({ entry }: { entry: DongsArchiveEntry }) {
  const colors = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface1, borderColor: colors.border }]}
      onPress={() => setExpanded((v) => !v)}
      accessibilityRole="button"
      accessibilityLabel={`${entry.name} 자세히 보기`}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.koreanName, { color: colors.textPrimary }]}>{entry.name}</Text>
        <Text style={[styles.chevron, { color: colors.textMuted }]}>{expanded ? '▾' : '▸'}</Text>
      </View>

      <Text
        style={[styles.locationText, { color: colors.textSecondary }]}
        numberOfLines={expanded ? undefined : 2}
      >
        {entry.location}
      </Text>

      {expanded && (
        <View style={styles.expandedBody}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.effectLabel, { color: colors.textMuted }]}>효능 및 자침 가이드</Text>
          <Text style={[styles.effectText, { color: colors.textSecondary }]}>{entry.effect}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function DongsArchiveScreen() {
  const colors = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return ARCHIVE;
    const q = query.trim().toLowerCase();
    return ARCHIVE.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.effect.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => groupByPhotoType(filtered), [filtered]);

  return (
    <View style={[styles.flex, { backgroundColor: colors.surface0 }]}>
      <View style={[styles.searchBar, { backgroundColor: colors.surface1, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="혈명, 위치, 효능 검색…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        <View style={[styles.infoBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            원문 자료 전체({ARCHIVE.length}개)를 그대로 옮긴 검색용 아카이브입니다. 자동 정리되지 않은
            원본이라 일부 항목은 표기가 불완전할 수 있습니다 — 처방 화면의 자동 태깅에는 사용되지 않고
            직접 검색·열람 용도로만 쓰입니다.
          </Text>
        </View>

        {filtered.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>'{query}' 검색 결과 없음</Text>
        ) : (
          Array.from(grouped.entries()).map(([photoType, entries]) => (
            <View key={photoType} style={styles.groupSection}>
              <Text style={[styles.groupLabel, { color: colors.textMuted }]}>
                {PHOTO_TYPE_LABEL[photoType] ?? photoType} ({entries.length})
              </Text>
              {entries.map((e) => (
                <ArchiveEntryCard key={e.id} entry={e} />
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
  emptyText: {
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginTop: spacing[8],
  },
  groupSection: {
    gap: spacing[2],
  },
  groupLabel: {
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
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  koreanName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  chevron: {
    fontSize: typography.fontSize.lg,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  expandedBody: {
    gap: spacing[2],
  },
  divider: {
    height: 1,
  },
  effectLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  effectText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.6,
  },
});
