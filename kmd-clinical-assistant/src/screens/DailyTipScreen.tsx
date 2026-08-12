import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { useDailyTip } from '../hooks/useDailyTip';
import type { DailyTip } from '../hooks/useDailyTip';

const CATEGORY_COLORS: Record<string, string> = {
  경혈: '#3b82f6',
  변증: '#f59e0b',
  처방: '#8b5cf6',
  섭생: '#22c55e',
};

function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? '#adb5bd';
}

// ── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({ tip, bookmarked, onBookmark }: { tip: DailyTip; bookmarked: boolean; onBookmark: () => void }) {
  const colors = useTheme();
  const color = categoryColor(tip.category);

  return (
    <View style={[styles.featuredCard, { backgroundColor: colors.surface1, borderColor: color }]}>
      <View style={styles.featuredTop}>
        <View style={[styles.categoryTag, { backgroundColor: color }]}>
          <Text style={styles.categoryTagText}>{tip.category}</Text>
        </View>
        <Text style={[styles.todayLabel, { color: colors.textMuted }]}>오늘의 팁</Text>
        <Pressable onPress={onBookmark} hitSlop={8} accessibilityLabel="북마크">
          <Text style={{ fontSize: 20 }}>{bookmarked ? '★' : '☆'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>{tip.title}</Text>
      <Text style={[styles.featuredBody, { color: colors.textSecondary }]}>{tip.body}</Text>
      <Text style={[styles.source, { color: colors.textMuted }]}>출처: {tip.source}</Text>
    </View>
  );
}

// ── Tip row ───────────────────────────────────────────────────────────────────

function TipRow({ tip, bookmarked, onBookmark, onPress }: {
  tip: DailyTip;
  bookmarked: boolean;
  onBookmark: () => void;
  onPress: () => void;
}) {
  const colors = useTheme();
  const color = categoryColor(tip.category);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tipRow, { borderColor: colors.border }]}
      accessibilityRole="button"
    >
      <View style={[styles.tipDot, { backgroundColor: color }]} />
      <View style={styles.tipContent}>
        <View style={[styles.tipCategoryTag, { backgroundColor: color + '22' }]}>
          <Text style={[styles.tipCategoryText, { color }]}>{tip.category}</Text>
        </View>
        <Text style={[styles.tipTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {tip.title}
        </Text>
      </View>
      <Pressable onPress={onBookmark} hitSlop={12} accessibilityLabel="북마크">
        <Text style={[styles.bookmarkIcon, { color: bookmarked ? color : colors.textMuted }]}>
          {bookmarked ? '★' : '☆'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

// ── Detail modal – inline expand ──────────────────────────────────────────────

function TipDetail({ tip, onClose }: { tip: DailyTip; onClose: () => void }) {
  const colors = useTheme();
  const color = categoryColor(tip.category);

  return (
    <View style={[styles.detailCard, { backgroundColor: colors.surface1, borderColor: color }]}>
      <View style={styles.detailHeader}>
        <View style={[styles.categoryTag, { backgroundColor: color }]}>
          <Text style={styles.categoryTagText}>{tip.category}</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={8}>
          <Text style={[styles.closeX, { color: colors.textMuted }]}>✕</Text>
        </Pressable>
      </View>
      <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>{tip.title}</Text>
      <Text style={[styles.featuredBody, { color: colors.textSecondary }]}>{tip.body}</Text>
      <Text style={[styles.source, { color: colors.textMuted }]}>출처: {tip.source}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function DailyTipScreen() {
  const colors = useTheme();
  const { featured, tips } = useDailyTip();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface0 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Featured */}
      <FeaturedCard
        tip={featured}
        bookmarked={bookmarks.has(featured.id)}
        onBookmark={() => toggleBookmark(featured.id)}
      />

      {/* More tips */}
      <Text style={[styles.moreLabel, { color: colors.textMuted }]}>더 많은 팁</Text>

      {tips.map((tip) => (
        <React.Fragment key={tip.id}>
          {expandedId === tip.id ? (
            <TipDetail tip={tip} onClose={() => setExpandedId(null)} />
          ) : (
            <TipRow
              tip={tip}
              bookmarked={bookmarks.has(tip.id)}
              onBookmark={() => toggleBookmark(tip.id)}
              onPress={() => setExpandedId(tip.id)}
            />
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[8],
  },
  // Featured
  featuredCard: {
    borderRadius: radii.lg,
    borderWidth: 1.5,
    padding: spacing[5],
    gap: spacing[3],
  },
  featuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  todayLabel: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  categoryTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  categoryTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: '#fff',
  },
  featuredTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.base * 1.4,
  },
  featuredBody: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.7,
  },
  source: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  moreLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing[2],
  },
  // Tip row
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  tipContent: {
    flex: 1,
    gap: spacing[1],
  },
  tipCategoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  tipCategoryText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  tipTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  bookmarkIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  // Detail
  detailCard: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeX: {
    fontSize: typography.fontSize.md,
  },
});
