import { apiRequest } from "./api";

export type PermissionAction =
  | "READ"
  | "UPDATE"
  | "CREATE"
  | "DELETE"
  | "AUTHORIZE_ACCESS";

export interface CreateAccessGrantDTO {
  professionalId: string;
  patientId: string;
  actions: PermissionAction[];
  expiresAt?: string;
}

export interface AccessGrantResponseDTO {
  id: string;
  professional: {
    id: string;
    name: string;
    specialty: string;
  };
  patient: {
    id: string;
    name: string;
  };
  actions: PermissionAction[];
  status: string;
  grantedAt: string;
  acceptedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  revocationReason: "MANUAL" | "EXPIRED" | null;
}

const PERMISSION_ACTIONS: PermissionAction[] = [
  "READ",
  "UPDATE",
  "CREATE",
  "DELETE",
  "AUTHORIZE_ACCESS",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAccessGrant(payload: unknown): AccessGrantResponseDTO {
  if (
    !isRecord(payload) ||
    typeof payload.id !== "string" ||
    !isRecord(payload.professional) ||
    typeof payload.professional.id !== "string" ||
    typeof payload.professional.name !== "string" ||
    typeof payload.professional.specialty !== "string" ||
    !isRecord(payload.patient) ||
    typeof payload.patient.id !== "string" ||
    typeof payload.patient.name !== "string" ||
    !Array.isArray(payload.actions) ||
    !payload.actions.every(
      (action): action is PermissionAction =>
        typeof action === "string" &&
        PERMISSION_ACTIONS.some((allowed) => allowed === action),
    ) ||
    typeof payload.status !== "string" ||
    typeof payload.grantedAt !== "string" ||
    !(typeof payload.acceptedAt === "string" || payload.acceptedAt === null) ||
    !(typeof payload.expiresAt === "string" || payload.expiresAt === null) ||
    !(typeof payload.revokedAt === "string" || payload.revokedAt === null) ||
    !(
      payload.revocationReason === "MANUAL" ||
      payload.revocationReason === "EXPIRED" ||
      payload.revocationReason === null
    )
  ) {
    throw new Error("El backend devolvió una autorización inválida.");
  }

  return {
    id: payload.id,
    professional: {
      id: payload.professional.id,
      name: payload.professional.name,
      specialty: payload.professional.specialty,
    },
    patient: {
      id: payload.patient.id,
      name: payload.patient.name,
    },
    actions: payload.actions,
    status: payload.status,
    grantedAt: payload.grantedAt,
    acceptedAt: payload.acceptedAt,
    expiresAt: payload.expiresAt,
    revokedAt: payload.revokedAt,
    revocationReason: payload.revocationReason,
  };
}

function parseAccessGrantList(payload: unknown): AccessGrantResponseDTO[] {
  if (!Array.isArray(payload)) {
    throw new Error("El backend devolvió una lista de autorizaciones inválida.");
  }

  return payload.map(parseAccessGrant);
}

function parseActionResponse(): void {
  return;
}

export function listAccessGrants(): Promise<AccessGrantResponseDTO[]> {
  return apiRequest("access-grants", parseAccessGrantList);
}

export function createAccessGrant(
  grant: CreateAccessGrantDTO,
): Promise<void> {
  return apiRequest("access-grants", parseActionResponse, {
    method: "POST",
    body: JSON.stringify(grant),
    allowEmptyResponse: true,
  });
}

export function acceptAccessGrant(id: string): Promise<void> {
  return apiRequest(
    `access-grants/${encodeURIComponent(id)}/accept`,
    parseActionResponse,
    { method: "PATCH", allowEmptyResponse: true },
  );
}

export function revokeAccessGrant(id: string): Promise<void> {
  return apiRequest(
    `access-grants/${encodeURIComponent(id)}/revoke`,
    parseActionResponse,
    { method: "PATCH", allowEmptyResponse: true },
  );
}
