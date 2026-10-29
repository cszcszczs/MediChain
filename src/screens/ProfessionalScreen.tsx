import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccessCredentialsSection } from "../components/professional/AccessCredentialsSection";
import { PersonalInformationSection } from "../components/professional/PersonalInformationSection";
import { ProfessionalInformationSection } from "../components/professional/ProfessionalInformationSection";
import { RegistrationFeedbackModal } from "../components/RegistrationFeedbackModal";
import { useProfessionalRegistration } from "../hooks/useProfessionalRegistration";
import { styles } from "../styles/PatientStyle";

export function ProfessionalScreen() {
  const {
    values,
    updateField,
    isSubmitting,
    errorMessage,
    successMessage,
    submit,
    clearFeedback,
  } = useProfessionalRegistration();

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
          <Text style={styles.title}>Registrar Profesional de Salud</Text>
          <Text style={styles.subtitle}>
            Complete el formulario para registrar un profesional médico
          </Text>

          <PersonalInformationSection
            values={values}
            onChange={updateField}
          />
          <ProfessionalInformationSection
            values={values}
            onChange={updateField}
          />
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
              <Text style={styles.submitButtonText}>
                Registrar Profesional
              </Text>
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
