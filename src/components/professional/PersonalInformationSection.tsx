import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { styles } from "../../styles/PatientStyle";
import {
  PROFESSIONAL_DOCUMENT_TYPES,
  ProfessionalFormValues,
} from "../../utils/professionalForm";

interface PersonalInformationSectionProps {
  values: ProfessionalFormValues;
  onChange: (field: keyof ProfessionalFormValues, value: string) => void;
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
        placeholder="María Elena"
      />
      <TextField
        label="Apellidos"
        required
        value={values.apellidos}
        onChangeText={(value) => onChange("apellidos", value)}
        placeholder="González Torres"
      />
      <SelectField
        label="Tipo Documento"
        required
        value={values.tipoDocumento}
        placeholder="Seleccione..."
        options={PROFESSIONAL_DOCUMENT_TYPES}
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
      <TextField
        label="Teléfono"
        required
        value={values.telefono}
        onChangeText={(value) => onChange("telefono", value)}
        placeholder="987654321"
        icon="phone"
        keyboardType="phone-pad"
      />
      <TextField
        label="Correo Electrónico"
        required
        value={values.correoElectronico}
        onChangeText={(value) => onChange("correoElectronico", value)}
        placeholder="doctor@hospital.com"
        icon="mail"
        keyboardType="email-address"
      />
    </View>
  );
}
