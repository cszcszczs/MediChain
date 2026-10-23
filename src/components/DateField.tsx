import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles as fieldStyles } from "../styles/TextFieldStyle";
import { styles } from "../styles/DateFieldStyle";
import { TextField } from "./TextField";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

function parseDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? date
    : undefined;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(value: string): string {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : value;
}

export function DateField({
  label,
  value,
  onChange,
  required,
  placeholder = "Seleccionar fecha",
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(
    () => parseDate(value) ?? new Date(),
  );

  if (Platform.OS === "web") {
    return (
      <TextField
        label={label}
        value={value}
        onChangeText={onChange}
        required={required}
        placeholder="AAAA-MM-DD"
        icon="calendar"
      />
    );
  }

  const openPicker = () => {
    setDraftDate(parseDate(value) ?? new Date());
    setPickerVisible(true);
  };

  const picker = (
    <DateTimePicker
      value={draftDate}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "calendar"}
      locale="es-CO"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onValueChange={(_event, date) => {
        if (Platform.OS === "ios") {
          setDraftDate(date);
        } else {
          onChange(formatDate(date));
          setPickerVisible(false);
        }
      }}
      onDismiss={() => setPickerVisible(false)}
    />
  );

  return (
    <View style={fieldStyles.fieldGroup}>
      <Text style={fieldStyles.label}>
        {label} {required && <Text style={fieldStyles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={fieldStyles.inputWrapper}
        activeOpacity={0.7}
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value ? displayDate(value) : placeholder}`}
      >
        <Feather
          name="calendar"
          size={16}
          color="#9CA3AF"
          style={fieldStyles.icon}
        />
        <Text style={[fieldStyles.input, !value && styles.placeholder]}>
          {value ? displayDate(value) : placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {Platform.OS === "ios" ? (
        <Modal
          visible={isPickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPickerVisible(false)}
          >
            <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setPickerVisible(false)}>
                  <Text style={styles.modalAction}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity
                  onPress={() => {
                    onChange(formatDate(draftDate));
                    setPickerVisible(false);
                  }}
                >
                  <Text style={styles.modalAction}>Listo</Text>
                </TouchableOpacity>
              </View>
              {picker}
            </Pressable>
          </Pressable>
        </Modal>
      ) : isPickerVisible ? (
        picker
      ) : null}
    </View>
  );
}
