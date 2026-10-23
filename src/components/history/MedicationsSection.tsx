import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "../TextField";
import type { MedicationFormEntry } from "../../hooks/useHistoryForm";
import { styles } from "../../styles/HistoryStyle";

interface MedicationsSectionProps {
  medications: MedicationFormEntry[];
  onAdd: () => void;
  onUpdate: (
    id: number,
    field: "nombre" | "dosis" | "frecuencia",
    value: string,
  ) => void;
  onRemove: (id: number) => void;
}

export function MedicationsSection({
  medications,
  onAdd,
  onUpdate,
  onRemove,
}: MedicationsSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.cardIconWrapper}>
            <MaterialCommunityIcons name="pill" size={16} color="#2563EB" />
          </View>
          <Text style={styles.cardTitle}>Medicamentos Recetados</Text>
        </View>
        <TouchableOpacity onPress={onAdd}>
          <Text style={styles.addLink}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {medications.map((medication, index) => (
        <View key={medication.id} style={styles.itemBox}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemLabel}>Medicamento {index + 1}</Text>
            {medications.length > 1 && (
              <TouchableOpacity onPress={() => onRemove(medication.id)}>
                <Text style={styles.removeLink}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextField
            value={medication.nombre}
            onChangeText={(value) =>
              onUpdate(medication.id, "nombre", value)
            }
            placeholder="Nombre del medicamento"
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <TextField
                value={medication.dosis}
                onChangeText={(value) =>
                  onUpdate(medication.id, "dosis", value)
                }
                placeholder="Dosis (500mg)"
              />
            </View>
            <View style={styles.halfField}>
              <TextField
                value={medication.frecuencia}
                onChangeText={(value) =>
                  onUpdate(medication.id, "frecuencia", value)
                }
                placeholder="Frecuencia"
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
