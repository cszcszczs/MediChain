import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TextField } from "../TextField";
import { styles } from "../../styles/PatientStyle";
import { PatientFormValues } from "../../utils/patientForm";

interface ContactInformationSectionProps {
  values: PatientFormValues;
  onChange: (field: keyof PatientFormValues, value: string) => void;
}

export function ContactInformationSection({
  values,
  onChange,
}: ContactInformationSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <Feather name="mail" size={16} color="#2563EB" />
        </View>
        <Text style={styles.cardTitle}>Información de Contacto</Text>
      </View>

      <TextField
        label="Correo Electrónico"
        required
        value={values.correoElectronico}
        onChangeText={(value) => onChange("correoElectronico", value)}
        placeholder="paciente@ejemplo.com"
        icon="mail"
        keyboardType="email-address"
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
        label="Ciudad"
        required
        value={values.ciudad}
        onChangeText={(value) => onChange("ciudad", value)}
        placeholder="Lima"
      />
      <TextField
        label="Dirección"
        required
        value={values.direccion}
        onChangeText={(value) => onChange("direccion", value)}
        placeholder="Av. Principal 123"
        icon="map-pin"
      />
    </View>
  );
}
