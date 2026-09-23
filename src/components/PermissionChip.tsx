import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/PermissionChipStyle';


export function PermissionChip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
