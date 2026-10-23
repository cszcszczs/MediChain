import { Text, View } from "react-native";
import { TextField } from "../TextField";
import { styles } from "../../styles/HistoryStyle";

interface VitalSignsSectionProps {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  onBloodPressureChange: (value: string) => void;
  onHeartRateChange: (value: string) => void;
  onTemperatureChange: (value: string) => void;
  onWeightChange: (value: string) => void;
}

export function VitalSignsSection({
  bloodPressure,
  heartRate,
  temperature,
  weight,
  onBloodPressureChange,
  onHeartRateChange,
  onTemperatureChange,
  onWeightChange,
}: VitalSignsSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.plainSectionTitle}>Signos Vitales</Text>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <TextField
            label="Presión Arterial"
            value={bloodPressure}
            onChangeText={onBloodPressureChange}
            placeholder="120/80 mmHg"
          />
        </View>
        <View style={styles.halfField}>
          <TextField
            label="Frec. Cardíaca"
            value={heartRate}
            onChangeText={onHeartRateChange}
            placeholder="72 bpm"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <TextField
            label="Temperatura"
            value={temperature}
            onChangeText={onTemperatureChange}
            placeholder="36.5 °C"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.halfField}>
          <TextField
            label="Peso"
            value={weight}
            onChangeText={onWeightChange}
            placeholder="70 kg"
            keyboardType="decimal-pad"
          />
        </View>
      </View>
    </View>
  );
}
