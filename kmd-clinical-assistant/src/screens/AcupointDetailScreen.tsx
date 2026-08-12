import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme, typography, spacing, radii } from '../theme';
import { useAcupoint } from '../hooks/useAcupoint';
import { AcupointDiagram } from '../components/AcupointDiagram';
import type { RootStackParamList } from '../navigation/types';

type AcupointDetailRoute = RouteProp<RootStackParamList, 'AcupointDetail'>;

// ── Section wrapper ────────────────────────────────────────────────────────────

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useTheme();
  return (
    <View style={[styles.section, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      {children}
    </View>
  );
}

// ── Row within a section ────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function AcupointDetailScreen() {
  const colors = useTheme();
  const route = useRoute<AcupointDetailRoute>();
  const acupoint = useAcupoint(route.params.code);

  if (!acupoint) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.surface0 }]}>
        <Text style={[styles.notFoundText, { color: colors.textMuted }]}>
          {route.params.code} — 데이터를 찾을 수 없습니다
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface0 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ① Body diagram with pulsing dot */}
      <AcupointDiagram acupoint={acupoint} />

      {/* ② Basic info */}
      <InfoSection title="경혈 정보">
        <InfoRow label="경락" value={acupoint.meridian} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <InfoRow label="위치" value={acupoint.location} />
      </InfoSection>

      {/* ③ Needling technique */}
      <InfoSection title="자침 요령">
        <InfoRow label="침심도" value={acupoint.depth} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <InfoRow label="자침 방향" value={acupoint.angle} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <InfoRow label="득기감" value={acupoint.sensation} />
      </InfoSection>

      {/* ④ Indications */}
      <View style={styles.indicationsBlock}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>주치 (적응증)</Text>
        <View style={styles.chipRow}>
          {acupoint.indications.map((ind) => (
            <View
              key={ind}
              style={[styles.chip, { backgroundColor: colors.accentSubtle, borderColor: colors.accentFill }]}
            >
              <Text style={[styles.chipText, { color: colors.accentFill }]}>{ind}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ⑤ Cautions */}
      {acupoint.cautions && (
        <View style={[styles.cautionBox, { backgroundColor: colors.dangerSubtle, borderColor: colors.dangerFill }]}>
          <Text style={[styles.cautionLabel, { color: colors.dangerFill }]}>⚠ 주의사항</Text>
          <Text style={[styles.cautionText, { color: colors.dangerFill }]}>{acupoint.cautions}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  // Section
  section: {
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  infoRow: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing[4],
  },
  // Indications
  indicationsBlock: {
    gap: spacing[3],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  // Caution
  cautionBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  cautionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  cautionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  notFoundText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    textAlign: 'center',
  },
});
