import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { PatientResponseDTO } from "../../services/patients";
import { styles } from "../../styles/HistoryStyle";

interface PatientInformationSectionProps {
  patients: PatientResponseDTO[];
  selectedPatientId: string;
  consultationDate: string;
  isLoadingPatients: boolean;
  onPatientChange: (id: string) => void;
  onConsultationDateChange: (date: string) => void;
}

export function PatientInformationSection({
  patients,
  selectedPatientId,
  consultationDate,
  isLoadingPatients,
  onPatientChange,
  onConsultationDateChange,
}: PatientInformationSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrapper}>
          <Feather name="user" size={16} color="#2563EB" />
        </View>
        <Text style={styles.cardTitle}>Información del Paciente</Text>
      </View>
      <SelectField
        label="Paciente"
        required
        value={selectedPatientId}
        placeholder={
          isLoadingPatients ? "Cargando pacientes..." : "Seleccione un paciente..."
        }
        options={patients.map((patient) => ({
          label: patient.name,
          value: patient.id,
        }))}
        onSelect={onPatientChange}
      />
      <TextField
        label="Fecha de Consulta"
        required
        value={consultationDate}
        onChangeText={onConsultationDateChange}
        placeholder="AAAA-MM-DD"
        icon="calendar"
      />
    </View>
  );
}
