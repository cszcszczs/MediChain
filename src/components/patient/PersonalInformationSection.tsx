import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { DateField } from "../DateField";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { styles } from "../../styles/PatientStyle";
import {
  DOCUMENT_TYPES,
  GENDERS,
  PatientFormValues,
} from "../../utils/patientForm";

interface PersonalInformationSectionProps {
  values: PatientFormValues;
  onChange: (field: keyof PatientFormValues, value: string) => void;
}

export function PersonalInformationSection({
  values,
  onChange,
}: PersonalInformationSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <Feather name="user" size={16} color="#2563EB" />
        </View>
        <Text style={styles.cardTitle}>Información Personal</Text>
      </View>

      <TextField
        label="Nombres"
        required
        value={values.nombres}
        onChangeText={(value) => onChange("nombres", value)}
        placeholder="Juan Carlos"
      />
      <TextField
        label="Apellidos"
        required
        value={values.apellidos}
        onChangeText={(value) => onChange("apellidos", value)}
        placeholder="Pérez García"
      />
      <SelectField
        label="Tipo Documento"
        required
        value={values.tipoDocumento}
        placeholder="Seleccione..."
        options={DOCUMENT_TYPES}
        onSelect={(value) => onChange("tipoDocumento", value)}
      />
      <TextField
        label="N° Documento"
        required
        value={values.numeroDocumento}
        onChangeText={(value) => onChange("numeroDocumento", value)}
        placeholder="12345678"
        icon="credit-card"
        keyboardType="numeric"
      />
      <DateField
        label="Fecha de Nacimiento"
        required
        value={values.fechaNacimiento}
        onChange={(value) => onChange("fechaNacimiento", value)}
        maximumDate={new Date()}
      />
      <SelectField
        label="Género"
        required
        value={values.genero}
        placeholder="Seleccione..."
        options={GENDERS}
        onSelect={(value) => onChange("genero", value)}
      />
    </View>
  );
}
