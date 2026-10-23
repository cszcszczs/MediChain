import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/CheckboxRowStyle';

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

// Checkbox en forma de fila/píldora, con cuadro que se rellena al marcar.
export function CheckboxRow({ label, checked, onToggle }: CheckboxRowProps) {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.7}
      onPress={onToggle}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <View style={styles.boxInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
