import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccessCredentialsSection } from "../components/patient/AccessCredentialsSection";
import { ContactInformationSection } from "../components/patient/ContactInformationSection";
import { PersonalInformationSection } from "../components/patient/PersonalInformationSection";
import { usePatientRegistration } from "../hooks/usePatientRegistration";
import { AppstackParamList } from "../types/navigation";
import { styles } from "../styles/PatientStyle";

type PatientScreenProps = NativeStackScreenProps<AppstackParamList, "Patient">;

export function PatientScreen({ navigation }: PatientScreenProps) {
  const {
    values,
    updateField,
    isSubmitting,
    errorMessage,
    successMessage,
    submit,
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

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate("Professional")}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Registrar Médico</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
