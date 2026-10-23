import {
  CreateAccessGrantDTO,
  PermissionAction,
} from "../services/accessGrants";

export const ACCESS_GRANT_PERMISSION_OPTIONS: {
  key: PermissionAction;
  label: string;
}[] = [
  { key: "READ", label: "Leer" },
  { key: "UPDATE", label: "Actualizar" },
  { key: "CREATE", label: "Crear" },
  { key: "DELETE", label: "Eliminar" },
  { key: "AUTHORIZE_ACCESS", label: "Autorizar accesos" },
];

export function prepareAccessGrant(
  professionalId: string,
  patientId: string,
  checkedPermissions: Record<PermissionAction, boolean>,
  expirationDate: string,
): { success: true; data: CreateAccessGrantDTO } | { success: false; error: string } {
  if (!professionalId || !patientId) {
    return {
      success: false,
      error: "Selecciona un profesional y un paciente.",
    };
  }

  const actions = ACCESS_GRANT_PERMISSION_OPTIONS
    .filter((permission) => checkedPermissions[permission.key])
    .map((permission) => permission.key);
  if (actions.length === 0) {
    return {
      success: false,
      error: "Selecciona al menos un permiso para autorizar.",
    };
  }

  const data: CreateAccessGrantDTO = {
    professionalId,
    patientId,
    actions,
  };

  if (expirationDate.trim()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) {
      return {
        success: false,
        error: "La fecha de expiración debe tener el formato AAAA-MM-DD.",
      };
    }

    const [year, month, day] = expirationDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return {
        success: false,
        error: "Ingresa una fecha de expiración válida.",
      };
    }
    if (date.getTime() <= Date.now()) {
      return {
        success: false,
        error: "La fecha de expiración debe ser futura.",
      };
    }

    data.expiresAt = date.toISOString();
  }

  return { success: true, data };
}

export function formatAccessGrantStatus(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    ACTIVE: "Activo",
    ACCEPTED: "Aceptado",
    REVOKED: "Revocado",
    EXPIRED: "Expirado",
  };

  return labels[status] ?? status;
}

export function formatPermissionAction(action: PermissionAction): string {
  return (
    ACCESS_GRANT_PERMISSION_OPTIONS.find((permission) => permission.key === action)
      ?.label ?? action
  );
}

export function formatProfessionalSpecialty(specialty: string): string {
  const labels: Record<string, string> = {
    GENERAL_MEDICINE: "Medicina General",
    PEDIATRICS: "Pediatría",
    CARDIOLOGY: "Cardiología",
    GENERAL_SURGERY: "Cirugía General",
    GYNECOLOGY: "Ginecología",
    DERMATOLOGY: "Dermatología",
    NEUROLOGY: "Neurología",
    PSYCHIATRY: "Psiquiatría",
    ORTHOPEDICS: "Ortopedia",
    OPHTHALMOLOGY: "Oftalmología",
  };

  return labels[specialty] ?? specialty;
}
