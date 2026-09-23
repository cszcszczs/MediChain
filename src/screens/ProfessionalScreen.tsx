import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "../components/TextField";
import { SelectField } from "../components/SelectField";
import { styles } from "../styles/PatientStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppstackParamList } from "../types/navigation";

const SPECIALTIES = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Cirugía General",
  "Ginecología",
  "Dermatología",
  "Neurología",
  "Psiquiatría",
  "Ortopedia",
  "Oftalmología",
];

const USER_STATUSES = ["Activo", "Inactivo", "Suspendido"];

type props = NativeStackScreenProps<AppstackParamList, "Professional">;

export function ProfessionalScreen({ navigation }: props) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [licenciaMedica, setLicenciaMedica] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [estadoUsuario, setEstadoUsuario] = useState("Activo");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const goToHistory = () => {
    navigation.navigate("History");
  };

  //const handleSubmit = () => {
  //  onSubmit?.({
  //    nombres,
  //    apellidos,
  //    numeroDocumento,
  //    telefono,
  //    correoElectronico,
  //    especialidad,
  //    licenciaMedica,
  //    institucion,
  //    estadoUsuario,
  //    password,
  //    confirmPassword,
  //  });
  //};

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

          {/* Tarjeta: Información Personal */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <Feather name="user" size={16} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Información Personal</Text>
            </View>

            <TextField
              label="Nombres"
              required
              value={nombres}
              onChangeText={setNombres}
              placeholder="María Elena"
            />

            <TextField
              label="Apellidos"
              required
              value={apellidos}
              onChangeText={setApellidos}
              placeholder="González Torres"
            />

            <TextField
              label="N° Documento"
              required
              value={numeroDocumento}
              onChangeText={setNumeroDocumento}
              placeholder="12345678"
              icon="credit-card"
              keyboardType="numeric"
            />

            <TextField
              label="Teléfono"
              required
              value={telefono}
              onChangeText={setTelefono}
              placeholder="987654321"
              icon="phone"
              keyboardType="phone-pad"
            />

            <TextField
              label="Correo Electrónico"
              required
              value={correoElectronico}
              onChangeText={setCorreoElectronico}
              placeholder="doctor@hospital.com"
              icon="mail"
              keyboardType="email-address"
            />
          </View>

          {/* Tarjeta: Información Profesional */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={16}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.cardTitle}>Información Profesional</Text>
            </View>

            <SelectField
              label="Especialidad"
              required
              value={especialidad}
              placeholder="Seleccione..."
              options={SPECIALTIES}
              onSelect={setEspecialidad}
            />

            <TextField
              label="N° Licencia Médica"
              required
              value={licenciaMedica}
              onChangeText={setLicenciaMedica}
              placeholder="CMP123456"
              icon="award"
            />

            <TextField
              label="Institución / Hospital"
              value={institucion}
              onChangeText={setInstitucion}
              placeholder="Hospital Nacional Dos de Mayo"
            />

            <SelectField
              label="Estado del Usuario"
              value={estadoUsuario}
              placeholder="Seleccione..."
              options={USER_STATUSES}
              onSelect={setEstadoUsuario}
            />
          </View>

          {/* Tarjeta: Configuración de Acceso */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <Feather name="lock" size={16} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Configuración de Acceso</Text>
            </View>

            <TextField
              label="Contraseña"
              required
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 8 caracteres"
              icon="lock"
              secureTextEntry
            />

            <TextField
              label="Confirmar Contraseña"
              required
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita la contraseña"
              icon="lock"
              secureTextEntry
            />
          </View>

          {/* Botones */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Registrar Profesional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          {/* BORRAR DESPUES */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={goToHistory}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Crear historial</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
