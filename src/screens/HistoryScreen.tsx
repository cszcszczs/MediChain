import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegistrationFeedbackModal } from "../components/RegistrationFeedbackModal";
import { AdditionalNotesSection } from "../components/history/AdditionalNotesSection";
import { AttachmentsSection } from "../components/history/AttachmentsSection";
import { DiagnosisSection } from "../components/history/DiagnosisSection";
import { ExamsSection } from "../components/history/ExamsSection";
import { MedicationsSection } from "../components/history/MedicationsSection";
import { PatientInformationSection } from "../components/history/PatientInformationSection";
import { TreatmentSection } from "../components/history/TreatmentSection";
import { VitalSignsSection } from "../components/history/VitalSignsSection";
import { useHistoryForm } from "../hooks/useHistoryForm";
import { styles } from "../styles/HistoryStyle";

export function HistoryScreen() {
  const form = useHistoryForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Gestión de Historial Clínico</Text>
          <Text style={styles.subtitle}>
            Crear o actualizar el historial médico del paciente
          </Text>

          {form.patientError ? (
            <View>
              <TouchableOpacity onPress={() => void form.refreshPatients()}>
                <Text style={styles.addLink}>Reintentar carga de pacientes</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <PatientInformationSection
            patients={form.patients}
            selectedPatientId={form.patientId}
            consultationDate={form.consultationDate}
            isLoadingPatients={form.isLoadingPatients}
            onPatientChange={form.setPatientId}
            onConsultationDateChange={form.setConsultationDate}
          />
          <VitalSignsSection
            bloodPressure={form.bloodPressure}
            heartRate={form.heartRate}
            temperature={form.temperature}
            weight={form.weight}
            onBloodPressureChange={form.setBloodPressure}
            onHeartRateChange={form.setHeartRate}
            onTemperatureChange={form.setTemperature}
            onWeightChange={form.setWeight}
          />
          <DiagnosisSection
            symptoms={form.symptoms}
            diagnosis={form.diagnosis}
            onSymptomsChange={form.setSymptoms}
            onDiagnosisChange={form.setDiagnosis}
          />
          <TreatmentSection
            treatment={form.treatment}
            onTreatmentChange={form.setTreatment}
          />
          <MedicationsSection
            medications={form.medications}
            onAdd={form.addMedication}
            onUpdate={form.updateMedication}
            onRemove={form.removeMedication}
          />
          <ExamsSection
            exams={form.exams}
            onAdd={form.addExam}
            onUpdate={form.updateExam}
            onRemove={form.removeExam}
          />
          <AttachmentsSection
            attachments={form.attachments}
            isSubmitting={form.isSubmitting}
            onPick={() => void form.pickAttachments()}
            onRemove={form.removeAttachment}
          />
          <AdditionalNotesSection
            notes={form.notes}
            onNotesChange={form.setNotes}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => void form.submit()}
            disabled={form.isSubmitting || form.isLoadingPatients}
            activeOpacity={0.85}
          >
            {form.isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather
                  name="save"
                  size={16}
                  color="#FFFFFF"
                  style={styles.submitButtonIcon}
                />
                <Text style={styles.submitButtonText}>Guardar Historial</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
      <RegistrationFeedbackModal
        type={
          form.errorMessage || form.patientError ? "error" : "success"
        }
        title={
          form.patientError
            ? "No se pudieron cargar pacientes"
            : form.errorMessage
              ? "No se pudo guardar"
              : "Historial guardado"
        }
        message={form.errorMessage || form.patientError || form.successMessage}
        onClose={() => {
          form.clearFeedback();
          form.clearPatientError();
        }}
      />
    </SafeAreaView>
  );
}
