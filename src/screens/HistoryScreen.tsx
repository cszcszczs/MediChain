import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextField } from '../components/TextField';
import { TextAreaField } from '../components/TextAreaField';
import { SelectField } from '../components/SelectField';
import { styles } from '../styles/HistoryStyle';

let nextId = 1;
const generateId = () => nextId++;

// Lista de ejemplo
const DEFAULT_ASSIGNED_PATIENTS = [
  'Juan Pérez González',
  'María Elena Torres',
  'Carlos Ramírez Silva',
];

export function HistoryScreen({
  assignedPatients = DEFAULT_ASSIGNED_PATIENTS,
  changeHistory = [
    {
      id: 'h1',
      action: 'Registro creado',
      author: 'Dr. María González',
      date: '14 may 2026, 10:30 AM',
    },
  ],
  onSubmit,
  onCancel,
  onUploadPress,
}) {
  // Información del paciente
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [fechaConsulta, setFechaConsulta] = useState('');

  // Signos vitales
  const [presionArterial, setPresionArterial] = useState('');
  const [frecCardiaca, setFrecCardiaca] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [peso, setPeso] = useState('');

  // Diagnóstico y síntomas
  const [sintomas, setSintomas] = useState('');
  const [diagnostico, setDiagnostico] = useState('');

  // Tratamiento
  const [tratamiento, setTratamiento] = useState('');

  // Medicamentos recetados (al menos uno visible por defecto)
  const [medicamentos, setMedicamentos] = useState([
    { id: generateId(), nombre: '', dosis: '', frecuencia: '' },
  ]);

  const addMedicamento = () => {
    setMedicamentos((prev) => [
      ...prev,
      { id: generateId(), nombre: '', dosis: '', frecuencia: '' },
    ]);
  };

  const updateMedicamento = (id, field, value) => {
    setMedicamentos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedicamento = (id) => {
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
  };

  // Resultados de exámenes (vacío por defecto)
  const [examenes, setExamenes] = useState([]);

  const addExamen = () => {
    setExamenes((prev) => [
      ...prev,
      { id: generateId(), nombre: '', resultado: '' },
    ]);
  };

  const updateExamen = (id, field, value) => {
    setExamenes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExamen = (id) => {
    setExamenes((prev) => prev.filter((e) => e.id !== id));
  };

  // Archivos adjuntos
  const [archivos, setArchivos] = useState([]);

  const handleUploadPress = () => {
    // Aquí se integraría un selector de archivos
    // expo-document-picker. De momento solo delega al padre.
    onUploadPress?.((file) => setArchivos((prev) => [...prev, file]));
  };

  // Notas adicionales
  const [notasAdicionales, setNotasAdicionales] = useState('');

  const handleSubmit = () => {
    onSubmit?.({
      pacienteSeleccionado,
      fechaConsulta,
      presionArterial,
      frecCardiaca,
      temperatura,
      peso,
      sintomas,
      diagnostico,
      tratamiento,
      medicamentos,
      examenes,
      archivos,
      notasAdicionales,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Gestión de Historial Clínico</Text>
          <Text style={styles.subtitle}>
            Crear o actualizar el historial médico del paciente
          </Text>

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
              placeholder="Seleccione un paciente..."
              options={assignedPatients}
              onSelect={setPacienteSeleccionado}
            />

            <TextField
              label="Fecha de Consulta"
              value={fechaConsulta}
              onChangeText={setFechaConsulta}
              placeholder="mm/dd/yyyy"
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
                  <MaterialCommunityIcons name="pill" size={16} color="#2563EB" />
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
                  onChangeText={(v) => updateMedicamento(med.id, 'nombre', v)}
                  placeholder="Nombre del medicamento"
                />

                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <TextField
                      value={med.dosis}
                      onChangeText={(v) => updateMedicamento(med.id, 'dosis', v)}
                      placeholder="Dosis (500mg)"
                    />
                  </View>
                  <View style={styles.halfField}>
                    <TextField
                      value={med.frecuencia}
                      onChangeText={(v) =>
                        updateMedicamento(med.id, 'frecuencia', v)
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
                    onChangeText={(v) => updateExamen(exam.id, 'nombre', v)}
                    placeholder="Nombre del examen"
                  />
                  <TextField
                    value={exam.resultado}
                    onChangeText={(v) => updateExamen(exam.id, 'resultado', v)}
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
            >
              <Feather name="upload-cloud" size={22} color="#9CA3AF" />
              <Text style={styles.uploadText}>
                Toca "Subir" para adjuntar archivos
              </Text>
            </TouchableOpacity>

            {archivos.map((file, index) => (
              <View key={`${file}-${index}`} style={styles.attachedFileRow}>
                <Text style={styles.attachedFileName} numberOfLines={1}>
                  {file}
                </Text>
                <Feather name="paperclip" size={14} color="#6B7280" />
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

          {/* Tarjeta: Historial de Cambios */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <Feather name="clock" size={16} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Historial de Cambios</Text>
            </View>

            {changeHistory.map((entry) => (
              <View key={entry.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View>
                  <Text style={styles.timelineAction}>{entry.action}</Text>
                  <Text style={styles.timelineMeta}>
                    {entry.author} · {entry.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Botones */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Feather
              name="save"
              size={16}
              color="#FFFFFF"
              style={styles.submitButtonIcon}
            />
            <Text style={styles.submitButtonText}>Guardar Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
