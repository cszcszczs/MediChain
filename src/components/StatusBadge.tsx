import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/StatusBadgeStyle';


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
