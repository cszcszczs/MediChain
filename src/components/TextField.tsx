import { useState } from 'react';
import { View, Text, TextInput  } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/TextFieldStyle';

export function TextField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  keyboardType,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        {icon && <Feather name={icon} size={16} color="#9CA3AF" style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}
