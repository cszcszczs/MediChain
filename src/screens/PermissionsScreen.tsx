import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SelectField } from '../components/SelectField';
import { TextField } from '../components/TextField';
import { CheckboxRow } from '../components/CheckboxRow';
import { StatusBadge } from '../components/StatusBadge';
import { PermissionChip } from '../components/PermissionChip';
import { styles } from '../styles/PermissionsStyle';

const STATUS_OPTIONS = ['Todos los estados', 'Activo', 'Revocado', 'Expirado'];

const PERMISSION_OPTIONS = [
  { key: 'leer', label: 'Leer' },
  { key: 'actualizar', label: 'Actualizar' },
  { key: 'crear', label: 'Crear' },
  { key: 'eliminar', label: 'Eliminar' },
  { key: 'autorizar', label: 'Autorizar Accesos' },
];

const DEFAULT_PROFESSIONALS = ['Dr. María González', 'Dr. Carlos Ruiz'];
const DEFAULT_PATIENTS = ['Juan Pérez González', 'Ana Martínez'];

const DEFAULT_GRANTS = [
  {
    id: 'g1',
    professional: 'Dr. María González',
    specialty: 'Medicina General',
    status: 'Activo',
    patient: 'Juan Pérez González',
    date: '01 ene 2026',
    permissions: ['Leer', 'Actualizar', 'Crear'],
  },
  {
    id: 'g2',
    professional: 'Dr. Carlos Ruiz',
    specialty: 'Cardiología',
    status: 'Activo',
    patient: 'Ana Martínez',
    date: '15 mar 2026',
    permissions: ['Leer'],
  },
];

export function PermissionsScreen({
  grants = DEFAULT_GRANTS,
  professionals = DEFAULT_PROFESSIONALS,
  patients = DEFAULT_PATIENTS,
  onAuthorize,
  onRevoke,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [modalVisible, setModalVisible] = useState(false);

  // Formulario del modal
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const [expirationDate, setExpirationDate] = useState('');

  const togglePermission = (key) => {
    setCheckedPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetForm = () => {
    setSelectedProfessional('');
    setSelectedPatient('');
    setCheckedPermissions({});
    setExpirationDate('');
  };

  const isFormValid =
    selectedProfessional &&
    selectedPatient &&
    Object.values(checkedPermissions).some(Boolean);

  const handleAuthorize = () => {
    if (!isFormValid) return;
    const grantedPermissions = PERMISSION_OPTIONS.filter(
      (p) => checkedPermissions[p.key]
    ).map((p) => p.label);

    onAuthorize?.({
      professional: selectedProfessional,
      patient: selectedPatient,
      permissions: grantedPermissions,
      expirationDate,
    });

    resetForm();
    setModalVisible(false);
  };

  const filteredGrants = useMemo(() => {
    return grants.filter((g) => {
      const matchesStatus =
        statusFilter === 'Todos los estados' || g.status === statusFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        g.professional.toLowerCase().includes(query) ||
        g.patient.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [grants, statusFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Gestión de Permisos</Text>
          <TouchableOpacity
            style={styles.authorizeButton}
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
          >
            <Feather
              name="user-check"
              size={15}
              color="#FFFFFF"
              style={styles.authorizeButtonIcon}
            />
            <Text style={styles.authorizeButtonText}>Autorizar</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador + filtro */}
        <View style={styles.filterCard}>
          <View style={styles.searchWrapper}>
            <Feather
              name="search"
              size={16}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar profesional, paciente..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <SelectField
            value={statusFilter}
            placeholder="Todos los estados"
            options={STATUS_OPTIONS}
            onSelect={setStatusFilter}
          />
        </View>

        {/* Lista de permisos otorgados */}
        {filteredGrants.length === 0 ? (
          <View style={styles.card}>
            <View style={styles.emptyStateBox}>
              <Text style={styles.emptyStateText}>
                No se encontraron permisos con esos filtros
              </Text>
            </View>
          </View>
        ) : (
          filteredGrants.map((grant) => (
            <View key={grant.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.professionalInfoRow}>
                  <View style={styles.avatar}>
                    <Feather name="user" size={18} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.professionalName}>
                      {grant.professional}
                    </Text>
                    <Text style={styles.professionalSpecialty}>
                      {grant.specialty}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={grant.status} />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Paciente</Text>
                <Text style={styles.infoValue}>{grant.patient}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoValue}>{grant.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Permisos</Text>
                <View style={styles.chipsWrapper}>
                  {grant.permissions.map((perm) => (
                    <PermissionChip key={perm} label={perm} />
                  ))}
                </View>
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.revokeButton}
                activeOpacity={0.7}
                onPress={() => onRevoke?.(grant.id)}
              >
                <Text style={styles.revokeButtonText}>Revocar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal: Autorizar Acceso */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconWrapper}>
                  <Feather name="shield" size={16} color="#2563EB" />
                </View>
                <Text style={styles.modalTitle}>Autorizar Acceso</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <SelectField
                label="Seleccionar Profesional"
                value={selectedProfessional}
                placeholder="Seleccione un profesional..."
                options={professionals}
                onSelect={setSelectedProfessional}
              />

              <SelectField
                label="Seleccionar Paciente"
                value={selectedPatient}
                placeholder="Seleccione un paciente..."
                options={patients}
                onSelect={setSelectedPatient}
              />

              <Text style={styles.modalSectionLabel}>Permisos a Otorgar</Text>
              {PERMISSION_OPTIONS.map((perm) => (
                <CheckboxRow
                  key={perm.key}
                  label={perm.label}
                  checked={!!checkedPermissions[perm.key]}
                  onToggle={() => togglePermission(perm.key)}
                />
              ))}

              <TextField
                label="Fecha de Expiración (Opcional)"
                value={expirationDate}
                onChangeText={setExpirationDate}
                placeholder="mm/dd/yyyy"
                icon="calendar"
              />
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalSubmitButton,
                !isFormValid && styles.modalSubmitButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!isFormValid}
              onPress={handleAuthorize}
            >
              <Text style={styles.modalSubmitButtonText}>
                Autorizar Acceso
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
