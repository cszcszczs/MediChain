import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/PermissionChipStyle';

interface PermissionChipProps {
  label: string;
}

export function PermissionChip({ label }: PermissionChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
