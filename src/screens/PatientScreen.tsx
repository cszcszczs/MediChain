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
import { Feather } from '@expo/vector-icons';
import { TextField } from '../components/TextField';
import { SelectField } from '../components/SelectField';
import { styles } from '../styles/PatientStyle';

const DOCUMENT_TYPES = ['DNI', 'Pasaporte', 'Cédula', 'Carné de Extranjería'];
const GENDERS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo'];

export function PatientScreen({ onSubmit, onCancel }) {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({
      nombres,
      apellidos,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      genero,
      correoElectronico,
      telefono,
      ciudad,
      direccion,
      password,
      confirmPassword,
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
          <Text style={styles.title}>Registrar Nuevo Paciente</Text>
          <Text style={styles.subtitle}>
            Complete el formulario para registrar un nuevo paciente
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
              placeholder="Juan Carlos"
            />

            <TextField
              label="Apellidos"
              required
              value={apellidos}
              onChangeText={setApellidos}
              placeholder="Pérez García"
            />

            <SelectField
              label="Tipo Documento"
              required
              value={tipoDocumento}
              placeholder="Seleccione..."
              options={DOCUMENT_TYPES}
              onSelect={setTipoDocumento}
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
              label="Fecha de Nacimiento"
              required
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="mm/dd/yyyy"
              icon="calendar"
            />

            <SelectField
              label="Género"
              required
              value={genero}
              placeholder="Seleccione..."
              options={GENDERS}
              onSelect={setGenero}
            />
          </View>

          {/* Tarjeta: Información de Contacto */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrapper}>
                <Feather name="mail" size={16} color="#2563EB" />
              </View>
              <Text style={styles.cardTitle}>Información de Contacto</Text>
            </View>

            <TextField
              label="Correo Electrónico"
              required
              value={correoElectronico}
              onChangeText={setCorreoElectronico}
              placeholder="paciente@ejemplo.com"
              icon="mail"
              keyboardType="email-address"
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
              label="Ciudad"
              value={ciudad}
              onChangeText={setCiudad}
              placeholder="Lima"
            />

            <TextField
              label="Dirección"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Av. Principal 123"
              icon="map-pin"
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
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Registrar Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          {/* BORRAR DESPUES */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => { }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Registrar Medico</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
