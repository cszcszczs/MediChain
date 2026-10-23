import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TextField } from "../TextField";
import { styles } from "../../styles/PatientStyle";
import { PatientFormValues } from "../../utils/patientForm";

interface AccessCredentialsSectionProps {
  values: PatientFormValues;
  onChange: (field: keyof PatientFormValues, value: string) => void;
}

export function AccessCredentialsSection({
  values,
  onChange,
}: AccessCredentialsSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <Feather name="lock" size={16} color="#2563EB" />
        </View>
        <Text style={styles.cardTitle}>Configuración de Acceso</Text>
      </View>

      <TextField
        label="Contraseña"
        required
        value={values.password}
        onChangeText={(value) => onChange("password", value)}
        placeholder="Mínimo 8 caracteres"
        icon="lock"
        secureTextEntry
      />
      <TextField
        label="Confirmar Contraseña"
        required
        value={values.confirmPassword}
        onChangeText={(value) => onChange("confirmPassword", value)}
        placeholder="Repita la contraseña"
        icon="lock"
        secureTextEntry
      />
    </View>
  );
}
