import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccessCredentialsSection } from "../components/patient/AccessCredentialsSection";
import { ContactInformationSection } from "../components/patient/ContactInformationSection";
import { PersonalInformationSection } from "../components/patient/PersonalInformationSection";
import { RegistrationFeedbackModal } from "../components/RegistrationFeedbackModal";
import { usePatientRegistration } from "../hooks/usePatientRegistration";
import { styles } from "../styles/PatientStyle";

export function PatientScreen() {
  const {
    values,
    updateField,
    isSubmitting,
    errorMessage,
    successMessage,
    submit,
    clearFeedback,
  } = usePatientRegistration();

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
          <Text style={styles.title}>Registrar Nuevo Paciente</Text>
          <Text style={styles.subtitle}>
            Complete el formulario para registrar un nuevo paciente
          </Text>

          <PersonalInformationSection
            values={values}
            onChange={updateField}
          />
          <ContactInformationSection values={values} onChange={updateField} />
          <AccessCredentialsSection values={values} onChange={updateField} />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => void submit()}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Paciente</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <RegistrationFeedbackModal
        type={errorMessage ? "error" : "success"}
        message={errorMessage || successMessage}
        onClose={clearFeedback}
      />
    </SafeAreaView>
  );
}
