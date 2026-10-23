import { Text, View } from "react-native";
import { TextAreaField } from "../TextAreaField";
import { styles } from "../../styles/HistoryStyle";

interface AdditionalNotesSectionProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export function AdditionalNotesSection({
  notes,
  onNotesChange,
}: AdditionalNotesSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.plainSectionTitle}>Notas Adicionales</Text>
      <TextAreaField
        value={notes}
        onChangeText={onNotesChange}
        placeholder="Observaciones, recomendaciones, seguimiento..."
      />
    </View>
  );
}
