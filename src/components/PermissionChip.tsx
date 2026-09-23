import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function PermissionChip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
