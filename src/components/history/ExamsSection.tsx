import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { ExamFormEntry } from "../../hooks/useHistoryForm";
import { styles } from "../../styles/HistoryStyle";
import { TextField } from "../TextField";

interface ExamsSectionProps {
  exams: ExamFormEntry[];
  onAdd: () => void;
  onUpdate: (id: number, field: "nombre" | "resultado", value: string) => void;
  onRemove: (id: number) => void;
}

export function ExamsSection({
  exams,
  onAdd,
  onUpdate,
  onRemove,
}: ExamsSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.cardIconWrapper}>
            <Feather name="droplet" size={16} color="#2563EB" />
          </View>
          <Text style={styles.cardTitle}>Resultados de Exámenes</Text>
        </View>
        <TouchableOpacity onPress={onAdd}>
          <Text style={styles.addLink}>+ Agregar</Text>
        </TouchableOpacity>
      </View>
      {exams.length === 0 ? (
        <View style={styles.emptyStateBox}>
          <Text style={styles.emptyStateText}>No hay exámenes registrados</Text>
        </View>
      ) : (
        exams.map((exam, index) => (
          <View key={exam.id} style={styles.itemBox}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemLabel}>Examen {index + 1}</Text>
              <TouchableOpacity onPress={() => onRemove(exam.id)}>
                <Text style={styles.removeLink}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            <TextField
              value={exam.nombre}
              onChangeText={(value) => onUpdate(exam.id, "nombre", value)}
              placeholder="Nombre del examen"
            />
            <TextField
              value={exam.resultado}
              onChangeText={(value) => onUpdate(exam.id, "resultado", value)}
              placeholder="Resultado"
            />
          </View>
        ))
      )}
    </View>
  );
}
