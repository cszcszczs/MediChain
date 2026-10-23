import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TextAreaField } from "../TextAreaField";
import { styles } from "../../styles/HistoryStyle";

interface DiagnosisSectionProps {
  symptoms: string;
  diagnosis: string;
  onSymptomsChange: (value: string) => void;
  onDiagnosisChange: (value: string) => void;
}

export function DiagnosisSection({
  symptoms,
  diagnosis,
  onSymptomsChange,
  onDiagnosisChange,
}: DiagnosisSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <Feather name="file-text" size={16} color="#2563EB" />
        </View>
        <Text style={styles.cardTitle}>Diagnóstico y Síntomas</Text>
      </View>
      <TextAreaField
        label="Síntomas Presentados"
        value={symptoms}
        onChangeText={onSymptomsChange}
        placeholder="Describa los síntomas del paciente..."
      />
      <TextAreaField
        label="Diagnóstico"
        required
        value={diagnosis}
        onChangeText={onDiagnosisChange}
        placeholder="Ingrese el diagnóstico médico detallado..."
      />
    </View>
  );
}
