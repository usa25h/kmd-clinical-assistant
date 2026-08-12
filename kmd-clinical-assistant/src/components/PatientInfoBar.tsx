import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';

export interface Patient {
  name: string;
  initials: string;
  age: number;
  sex: '남' | '여';
  visitType: '초진' | '재진';
  lastVisitDate: string;
}

interface PatientInfoBarProps {
  patient: Patient;
}

export function PatientInfoBar({ patient }: PatientInfoBarProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.accentSubtle }]}>
        <Text style={[styles.avatarText, { color: colors.accentFill }]}>{patient.initials}</Text>
      </View>

      {/* Name + meta */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{patient.name}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {patient.age}세 {patient.sex}성
        </Text>
      </View>

      {/* Badges */}
      <View style={styles.badges}>
        <View
          style={[
            styles.visitBadge,
            {
              backgroundColor: patient.visitType === '초진' ? colors.accentSubtle : colors.surface2,
              borderColor: patient.visitType === '초진' ? colors.accentFill : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.visitBadgeText,
              { color: patient.visitType === '초진' ? colors.accentFill : colors.textMuted },
            ]}
          >
            {patient.visitType}
          </Text>
        </View>
        <Text style={[styles.lastVisit, { color: colors.textMuted }]}>
          최근 방문 {patient.lastVisitDate}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  meta: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  badges: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  visitBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  visitBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  lastVisit: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
});
