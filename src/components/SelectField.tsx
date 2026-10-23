import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/SelectFieldStyle';

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  options: (string | { label: string; value: string })[];
  onSelect: (value: string) => void;
}

export function SelectField({
  label,
  required,
  value,
  placeholder,
  options,
  onSelect,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selectedLabel = options.find(
    (item) => (typeof item === 'string' ? item : item.value) === value,
  );

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
          {selectedLabel
            ? typeof selectedLabel === 'string'
              ? selectedLabel
              : selectedLabel.label
            : placeholder}
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
              keyExtractor={(item) =>
                typeof item === 'string' ? item : item.value
              }
              renderItem={({ item }) => {
                const option =
                  typeof item === 'string'
                    ? { label: item, value: item }
                    : item;
                const isSelected = option.value === value;

                return (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      onSelect(option.value);
                      setOpen(false);
                      setFocused(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
