import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export function SaamLookupScreen() {
  const colors = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.surface0 }]}>
      <Text style={{ color: colors.textPrimary }}>사암침 참조 — 준비 중</Text>
    </View>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
