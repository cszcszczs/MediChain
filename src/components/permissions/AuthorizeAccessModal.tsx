import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckboxRow } from "../CheckboxRow";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { PatientResponseDTO } from "../../services/patients";
import { ProfessionalResponseDTO } from "../../services/professionals";
import {
  CreateAccessGrantDTO,
  PermissionAction,
} from "../../services/accessGrants";
import { styles } from "../../styles/PermissionsStyle";
import {
  ACCESS_GRANT_PERMISSION_OPTIONS,
  prepareAccessGrant,
} from "../../utils/accessGrantForm";

interface AuthorizeAccessModalProps {
  visible: boolean;
  patients: PatientResponseDTO[];
  professionals: ProfessionalResponseDTO[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (grant: CreateAccessGrantDTO) => Promise<boolean>;
}

const EMPTY_PERMISSIONS: Record<PermissionAction, boolean> = {
  READ: false,
  UPDATE: false,
  CREATE: false,
  DELETE: false,
  AUTHORIZE_ACCESS: false,
};

export function AuthorizeAccessModal({
  visible,
  patients,
  professionals,
  isLoading,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AuthorizeAccessModalProps) {
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [checkedPermissions, setCheckedPermissions] =
    useState(EMPTY_PERMISSIONS);
  const [expirationDate, setExpirationDate] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setSelectedProfessional("");
    setSelectedPatient("");
    setCheckedPermissions(EMPTY_PERMISSIONS);
    setExpirationDate("");
    setFormError("");
  };

  const close = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const request = prepareAccessGrant(
      selectedProfessional,
      selectedPatient,
      checkedPermissions,
      expirationDate,
    );
    if (!request.success) {
      setFormError(request.error);
      return;
    }

    if (await onSubmit(request.data)) {
      close();
    }
  };

  const hasSelectedPermission = Object.values(checkedPermissions).some(Boolean);
  const isSubmitDisabled =
    !hasSelectedPermission || isSubmitting || isLoading || Boolean(error);

  const togglePermission = (key: PermissionAction) => {
    setCheckedPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <Feather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {formError || error ? (
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              {formError || error}
            </Text>
          ) : null}

          <ScrollView keyboardShouldPersistTaps="handled">
            <SelectField
              label="Seleccionar Profesional"
              required
              value={selectedProfessional}
              placeholder="Seleccione un profesional..."
              options={professionals.map((professional) => ({
                label: `${professional.firstName} ${professional.lastName}`,
                value: professional.id,
              }))}
              onSelect={setSelectedProfessional}
            />
            <SelectField
              label="Seleccionar Paciente"
              required
              value={selectedPatient}
              placeholder="Seleccione un paciente..."
              options={patients.map((patient) => ({
                label: patient.name,
                value: patient.id,
              }))}
              onSelect={setSelectedPatient}
            />
            <Text style={styles.modalSectionLabel}>Permisos a Otorgar</Text>
            {ACCESS_GRANT_PERMISSION_OPTIONS.map((permission) => (
              <CheckboxRow
                key={permission.key}
                label={permission.label}
                checked={checkedPermissions[permission.key]}
                onToggle={() => togglePermission(permission.key)}
              />
            ))}
            <TextField
              label="Fecha de Expiración (Opcional)"
              value={expirationDate}
              onChangeText={setExpirationDate}
              placeholder="AAAA-MM-DD"
              icon="calendar"
            />
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.modalSubmitButton,
              isSubmitDisabled && styles.modalSubmitButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={isSubmitDisabled}
            onPress={() => void handleSubmit()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.modalSubmitButtonText}>
                Autorizar Acceso
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
