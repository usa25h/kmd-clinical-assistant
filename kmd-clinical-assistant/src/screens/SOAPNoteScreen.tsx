import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useTheme, typography, spacing, radii } from '../theme';
import { useSOAPNote } from '../hooks/useSOAPNote';
import type { SOAPSection } from '../hooks/useSOAPNote';

const SECTION_COLORS: Record<SOAPSection['key'], string> = {
  S: '#3b82f6',
  O: '#22c55e',
  A: '#f59e0b',
  P: '#8b5cf6',
};

function SectionCard({
  section,
  onUpdate,
}: {
  section: SOAPSection;
  onUpdate: (content: string) => void;
}) {
  const colors = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.content);
  const accentColor = SECTION_COLORS[section.key];

  const handleSave = useCallback(() => {
    onUpdate(draft);
    setEditing(false);
  }, [draft, onUpdate]);

  const handleCancel = useCallback(() => {
    setDraft(section.content);
    setEditing(false);
  }, [section.content]);

  return (
    <View style={[styles.soapCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={[styles.sectionBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.sectionLetter}>{section.key}</Text>
        </View>
        <View style={styles.cardTitles}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{section.label}</Text>
          <Text style={[styles.cardLabelKo, { color: colors.textMuted }]}>{section.labelKorean}</Text>
        </View>
        {!editing && (
          <Pressable
            onPress={() => setEditing(true)}
            style={[styles.editBtn, { borderColor: colors.border }]}
            accessibilityLabel={`${section.label} 편집`}
          >
            <Text style={[styles.editBtnText, { color: colors.textSecondary }]}>편집</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      {editing ? (
        <View style={styles.editBlock}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            autoFocus
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface0,
                borderColor: accentColor,
              },
            ]}
            placeholderTextColor={colors.textMuted}
          />
          <View style={styles.editActions}>
            <Pressable onPress={handleCancel} style={[styles.actionBtn, { borderColor: colors.border }]}>
              <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>취소</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.actionBtn, styles.saveBtn, { backgroundColor: accentColor }]}>
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>저장</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>{section.content}</Text>
      )}
    </View>
  );
}

export function SOAPNoteScreen() {
  const colors = useTheme();
  const { sections, updateSection, isLoading } = useSOAPNote();

  const handleShare = useCallback(async () => {
    const fullText = sections
      .map((s) => `[${s.key}] ${s.label}\n${s.content}`)
      .join('\n\n');
    await Share.share({ message: fullText, title: 'SOAP 노트' });
  }, [sections]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface0 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accentFill} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            AI가 SOAP 노트를 작성하는 중…
          </Text>
        </View>
      )}

      {sections.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          onUpdate={(content) => updateSection(section.key, content)}
        />
      ))}

      {/* Export */}
      <Pressable
        onPress={handleShare}
        style={[styles.exportBtn, { backgroundColor: colors.accentFill }]}
        accessibilityRole="button"
        accessibilityLabel="SOAP 노트 공유"
      >
        <Text style={[styles.exportBtnText, { color: colors.accentText }]}>SOAP 노트 공유</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  soapCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLetter: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: '#fff',
  },
  cardTitles: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  cardLabelKo: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
  },
  editBtn: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  editBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  contentText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.7,
  },
  editBlock: {
    gap: spacing[3],
  },
  textInput: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * 1.7,
    borderWidth: 1.5,
    borderRadius: radii.sm,
    padding: spacing[3],
    minHeight: 120,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'flex-end',
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  saveBtn: {
    borderWidth: 0,
  },
  actionBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  exportBtn: {
    borderRadius: radii.md,
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  exportBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
  },
});
