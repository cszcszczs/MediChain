import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import type { DocumentPickerAsset } from "expo-document-picker";
import { TextField } from "../components/TextField";
import { TextAreaField } from "../components/TextAreaField";
import { SelectField } from "../components/SelectField";
import { styles } from "../styles/HistoryStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppstackParamList } from "../types/navigation";
import { usePatients } from "../hooks/usePatients";
import { createHistory } from "../services/history";
import { prepareHistory } from "../utils/historyForm";

type props = NativeStackScreenProps<AppstackParamList, "History">;
type MedicationFormEntry = {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
};
type ExamFormEntry = {
  id: number;
  nombre: string;
  resultado: string;
};

let nextId = 1;
const generateId = () => nextId++;

export function HistoryScreen({ navigation }: props) {
  const { patients, isLoading: isLoadingPatients, error: patientError, refresh } =
    usePatients();

  // Información del paciente
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [fechaConsulta, setFechaConsulta] = useState(
    new Date().toISOString().slice(0, 10),
  );

  // Signos vitales
  const [presionArterial, setPresionArterial] = useState("");
  const [frecCardiaca, setFrecCardiaca] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [peso, setPeso] = useState("");

  // Diagnóstico y síntomas
  const [sintomas, setSintomas] = useState("");
  const [diagnostico, setDiagnostico] = useState("");

  // Tratamiento
  const [tratamiento, setTratamiento] = useState("");

  // Medicamentos recetados (al menos uno visible por defecto)
  const [medicamentos, setMedicamentos] = useState<MedicationFormEntry[]>([
    { id: generateId(), nombre: "", dosis: "", frecuencia: "" },
  ]);
  const [examenes, setExamenes] = useState<ExamFormEntry[]>([]);
  const [archivos, setArchivos] = useState<DocumentPickerAsset[]>([]);
  const [notasAdicionales, setNotasAdicionales] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addMedicamento = () => {
    setMedicamentos((prev) => [
      ...prev,
      { id: generateId(), nombre: "", dosis: "", frecuencia: "" },
    ]);
  };

  const updateMedicamento = (
    id: number,
    field: "nombre" | "dosis" | "frecuencia",
    value: string,
  ) => {
    setMedicamentos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const removeMedicamento = (id: number) => {
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
  };

  const addExamen = () => {
    setExamenes((prev) => [
      ...prev,
      { id: generateId(), nombre: "", resultado: "" },
    ]);
  };

  const updateExamen = (
    id: number,
    field: "nombre" | "resultado",
    value: string,
  ) => {
    setExamenes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const removeExamen = (id: number) => {
    setExamenes((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUploadPress = async () => {
    setErrorMessage("");

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (archivos.length + result.assets.length > 5) {
        setErrorMessage("Puedes adjuntar un máximo de 5 archivos.");
        return;
      }

      const oversizedFile = result.assets.find(
        (asset) => asset.size !== undefined && asset.size > 10 * 1024 * 1024,
      );
      if (oversizedFile) {
        setErrorMessage(`El archivo "${oversizedFile.name}" supera el límite de 10 MB.`);
        return;
      }

      setArchivos((current) => [...current, ...result.assets]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron seleccionar los archivos.",
      );
    }
  };

  const handleSubmit = async () => {
    const form = prepareHistory(
      {
        patientId: pacienteSeleccionado,
        consultationDate: fechaConsulta,
        symptoms: sintomas,
        diagnosis: diagnostico,
        treatment: tratamiento,
        bloodPressure: presionArterial,
        heartRate: frecCardiaca,
        temperature: temperatura,
        weight: peso,
        medications: medicamentos,
        exams: examenes,
        notes: notasAdicionales,
      },
      archivos,
    );

    if (!form.success) {
      setErrorMessage(form.error);
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createHistory(form.data, archivos);
      setSuccessMessage("El historial clínico se guardó correctamente.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al guardar el historial.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAttachment = (uri: string) => {
    setArchivos((current) => current.filter((file) => file.uri !== uri));
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
          <Text style={styles.title}>Gestión de Historial Clínico</Text>
          <Text style={styles.subtitle}>
            Crear o actualizar el historial médico del paciente
          </Text>

          {patientError ? (
            <View>
              <Text accessibilityRole="alert" style={styles.errorMessage}>
                {patientError}
              </Text>
              <TouchableOpacity onPress={() => void refresh()}>
                <Text style={styles.addLink}>Reintentar carga de pacientes</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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

          {/* Tarjeta: Información del Paciente */}
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
              value={pacienteSeleccionado}
              placeholder={
                isLoadingPatients
                  ? "Cargando pacientes..."
                  : "Seleccione un paciente..."
              }
              options={patients.map((patient) => ({
                label: patient.name,
                value: patient.id,
              }))}
              onSelect={setPacienteSeleccionado}
            />

            <TextField
              label="Fecha de Consulta"
              required
              value={fechaConsulta}
              onChangeText={setFechaConsulta}
              placeholder="AAAA-MM-DD"
              icon="calendar"
            />
          </View>

          {/* Tarjeta: Signos Vitales */}
          <View style={styles.card}>
            <Text style={styles.plainSectionTitle}>Signos Vitales</Text>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <TextField
                  label="Presión Arterial"
                  value={presionArterial}
                  onChangeText={setPresionArterial}
                  placeholder="120/80 mmHg"
                />
              </View>
              <View style={styles.halfField}>
                <TextField
                  label="Frec. Cardíaca"
                  value={frecCardiaca}
                  onChangeText={setFrecCardiaca}
                  placeholder="72 bpm"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <TextField
                  label="Temperatura"
                  value={temperatura}
                  onChangeText={setTemperatura}
                  placeholder="36.5 °C"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfField}>
                <TextField
                  label="Peso"
                  value={peso}
                  onChangeText={setPeso}
                  placeholder="70 kg"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          {/* Tarjeta: Diagnóstico y Síntomas */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <Feather name="file-text" size={16} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Diagnóstico y Síntomas</Text>
            </View>

            <TextAreaField
              label="Síntomas Presentados"
              value={sintomas}
              onChangeText={setSintomas}
              placeholder="Describa los síntomas del paciente..."
            />

            <TextAreaField
              label="Diagnóstico"
              required
              value={diagnostico}
              onChangeText={setDiagnostico}
              placeholder="Ingrese el diagnóstico médico detallado..."
            />
          </View>

          {/* Tarjeta: Tratamiento */}
          <View style={styles.card}>
            <Text style={styles.plainSectionTitle}>
              Tratamiento <Text style={styles.required}>*</Text>
            </Text>

            <TextAreaField
              value={tratamiento}
              onChangeText={setTratamiento}
              placeholder="Describa el plan de tratamiento recomendado..."
            />
          </View>

          {/* Tarjeta: Medicamentos Recetados */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.cardIconWrapper}>
                  <MaterialCommunityIcons
                    name="pill"
                    size={16}
                    color="#2563EB"
                  />
                </View>
                <Text style={styles.cardTitle}>Medicamentos Recetados</Text>
              </View>
              <TouchableOpacity onPress={addMedicamento}>
                <Text style={styles.addLink}>+ Agregar</Text>
              </TouchableOpacity>
            </View>

            {medicamentos.map((med, index) => (
              <View key={med.id} style={styles.itemBox}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemLabel}>Medicamento {index + 1}</Text>
                  {medicamentos.length > 1 && (
                    <TouchableOpacity onPress={() => removeMedicamento(med.id)}>
                      <Text style={styles.removeLink}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TextField
                  value={med.nombre}
                  onChangeText={(v) => updateMedicamento(med.id, "nombre", v)}
                  placeholder="Nombre del medicamento"
                />

                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <TextField
                      value={med.dosis}
                      onChangeText={(v) =>
                        updateMedicamento(med.id, "dosis", v)
                      }
                      placeholder="Dosis (500mg)"
                    />
                  </View>
                  <View style={styles.halfField}>
                    <TextField
                      value={med.frecuencia}
                      onChangeText={(v) =>
                        updateMedicamento(med.id, "frecuencia", v)
                      }
                      placeholder="Frecuencia"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Tarjeta: Resultados de Exámenes */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.cardIconWrapper}>
                  <Feather name="droplet" size={16} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Resultados de Exámenes</Text>
              </View>
              <TouchableOpacity onPress={addExamen}>
                <Text style={styles.addLink}>+ Agregar</Text>
              </TouchableOpacity>
            </View>

            {examenes.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Text style={styles.emptyStateText}>
                  No hay exámenes registrados
                </Text>
              </View>
            ) : (
              examenes.map((exam, index) => (
                <View key={exam.id} style={styles.itemBox}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemLabel}>Examen {index + 1}</Text>
                    <TouchableOpacity onPress={() => removeExamen(exam.id)}>
                      <Text style={styles.removeLink}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>

                  <TextField
                    value={exam.nombre}
                    onChangeText={(v) => updateExamen(exam.id, "nombre", v)}
                    placeholder="Nombre del examen"
                  />
                  <TextField
                    value={exam.resultado}
                    onChangeText={(v) => updateExamen(exam.id, "resultado", v)}
                    placeholder="Resultado"
                  />
                </View>
              ))
            )}
          </View>

          {/* Tarjeta: Archivos Adjuntos */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.cardIconWrapper}>
                  <Feather name="upload" size={16} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Archivos Adjuntos</Text>
              </View>
              <TouchableOpacity onPress={handleUploadPress}>
                <Text style={styles.addLink}>↑ Subir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.uploadBox}
              activeOpacity={0.7}
              onPress={handleUploadPress}
              disabled={isSubmitting || archivos.length >= 5}
            >
              <Feather name="upload-cloud" size={22} color="#9CA3AF" />
              <Text style={styles.uploadText}>
                {archivos.length >= 5
                  ? "Límite de 5 archivos alcanzado"
                  : `Toca "Subir" para adjuntar archivos (${archivos.length}/5)`}
              </Text>
            </TouchableOpacity>

            {archivos.map((file) => (
              <View key={file.uri} style={styles.attachedFileRow}>
                <View style={styles.attachedFileInfo}>
                  <Feather name="paperclip" size={14} color="#6B7280" />
                  <Text style={styles.attachedFileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeAttachment(file.uri)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.removeLink}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Tarjeta: Notas Adicionales */}
          <View style={styles.card}>
            <Text style={styles.plainSectionTitle}>Notas Adicionales</Text>
            <TextAreaField
              value={notasAdicionales}
              onChangeText={setNotasAdicionales}
              placeholder="Observaciones, recomendaciones, seguimiento..."
            />
          </View>

          {/* Botones */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoadingPatients}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
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

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate("Permissions")}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Gestionar Permisos</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
