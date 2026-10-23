import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/StatusBadgeStyle';

interface StatusBadgeProps {
  status: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Activo: { bg: '#DCFCE7', text: '#16A34A' },
  Aceptado: { bg: '#DCFCE7', text: '#16A34A' },
  Pendiente: { bg: '#FEF3C7', text: '#D97706' },
  Revocado: { bg: '#FEE2E2', text: '#DC2626' },
  Expirado: { bg: '#F3F4F6', text: '#6B7280' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Expirado;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}
