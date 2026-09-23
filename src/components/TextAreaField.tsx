import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles } from '../styles/TextAreaFieldStyle';

// Textarea reutilizable con label, asterisco de requerido y borde azul al enfocar.
export function TextAreaField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  minHeight = 90,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      {label ? (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      ) : null}
      <TextInput
        style={[
          styles.textArea,
          { minHeight },
          focused && styles.textAreaFocused,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}
