import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Checkbox en forma de fila/píldora, con cuadro que se rellena al marcar.
export function CheckboxRow({ label, checked, onToggle }) {
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

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: '#374151',
    borderColor: '#374151',
  },
  boxInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});
