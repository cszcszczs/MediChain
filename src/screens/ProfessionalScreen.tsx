import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccessCredentialsSection } from "../components/professional/AccessCredentialsSection";
import { PersonalInformationSection } from "../components/professional/PersonalInformationSection";
import { ProfessionalInformationSection } from "../components/professional/ProfessionalInformationSection";
import { useProfessionalRegistration } from "../hooks/useProfessionalRegistration";
import { AppstackParamList } from "../types/navigation";
import { styles } from "../styles/PatientStyle";

type ProfessionalScreenProps = NativeStackScreenProps<
  AppstackParamList,
  "Professional"
>;

export function ProfessionalScreen({ navigation }: ProfessionalScreenProps) {
  const {
    values,
    updateField,
    isSubmitting,
    errorMessage,
    successMessage,
    submit,
  } = useProfessionalRegistration();

  const openHistory = () => {
    navigation.navigate("History");
  };

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

          {errorMessage ? (
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              {errorMessage}
            </Text>
          ) : null}
          {successMessage ? (
            <Text accessibilityRole="alert" style={styles.successMessage}>
              {successMessage}
            </Text>
          ) : null}

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

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={openHistory}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Crear historial</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
