import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/SelectFieldStyle';


export function SelectField({ label, required, value, placeholder, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
        activeOpacity={0.7}
        onPress={() => {
          setFocused(true);
          setOpen(true);
        }}
      >
        <Text style={value ? styles.selectValue : styles.placeholderText}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setOpen(false);
            setFocused(false);
          }}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                    setFocused(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      item === value && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Feather name="check" size={16} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
