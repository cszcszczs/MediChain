import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { styles } from "../../styles/PatientStyle";
import {
  PROFESSIONAL_SPECIALTIES,
  ProfessionalFormValues,
} from "../../utils/professionalForm";

interface ProfessionalInformationSectionProps {
  values: ProfessionalFormValues;
  onChange: (field: keyof ProfessionalFormValues, value: string) => void;
}

export function ProfessionalInformationSection({
  values,
  onChange,
}: ProfessionalInformationSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <MaterialCommunityIcons
            name="stethoscope"
            size={16}
            color="#2563EB"
          />
        </View>
        <Text style={styles.cardTitle}>Información Profesional</Text>
      </View>

      <SelectField
        label="Especialidad"
        required
        value={values.especialidad}
        placeholder="Seleccione..."
        options={PROFESSIONAL_SPECIALTIES}
        onSelect={(value) => onChange("especialidad", value)}
      />
      <TextField
        label="N° Licencia Médica"
        required
        value={values.licenciaMedica}
        onChangeText={(value) => onChange("licenciaMedica", value)}
        placeholder="CMP123456"
        icon="award"
      />
      <TextField
        label="Institución / Hospital"
        required
        value={values.institucion}
        onChangeText={(value) => onChange("institucion", value)}
        placeholder="Hospital Nacional Dos de Mayo"
      />
    </View>
  );
}
