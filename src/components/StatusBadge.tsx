import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STATUS_COLORS = {
  Activo: { bg: '#DCFCE7', text: '#16A34A' },
  Revocado: { bg: '#FEE2E2', text: '#DC2626' },
  Expirado: { bg: '#F3F4F6', text: '#6B7280' },
};

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Expirado;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
