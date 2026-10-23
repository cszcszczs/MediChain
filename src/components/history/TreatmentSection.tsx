import { Text, View } from "react-native";
import { TextAreaField } from "../TextAreaField";
import { styles } from "../../styles/HistoryStyle";

interface TreatmentSectionProps {
  treatment: string;
  onTreatmentChange: (value: string) => void;
}

export function TreatmentSection({
  treatment,
  onTreatmentChange,
}: TreatmentSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.plainSectionTitle}>
        Tratamiento <Text style={styles.required}>*</Text>
      </Text>
      <TextAreaField
        value={treatment}
        onChangeText={onTreatmentChange}
        placeholder="Describa el plan de tratamiento recomendado..."
      />
    </View>
  );
}
