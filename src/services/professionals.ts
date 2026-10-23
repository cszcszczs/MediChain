import { apiRequest } from "./api";

export type ProfessionalSpecialty =
  | "GENERAL_MEDICINE"
  | "PEDIATRICS"
  | "CARDIOLOGY"
  | "GENERAL_SURGERY"
  | "GYNECOLOGY"
  | "DERMATOLOGY"
  | "NEUROLOGY"
  | "PSYCHIATRY"
  | "ORTHOPEDICS"
  | "OPHTHALMOLOGY";

export type ProfessionalDocumentType =
  | "CEDULA"
  | "TARJETA_IDENTIDAD"
  | "PASAPORTE"
  | "CEDULA_EXTRANJERIA";

export type ProfessionalUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface CreateProfessionalDTO {
  firstName: string;
  lastName: string;
  documentType: ProfessionalDocumentType;
  documentNumber: string;
  phone: string;
  email: string;
  specialty: ProfessionalSpecialty;
  medicalLicense: string;
  institution: string;
  password: string;
}

export interface ProfessionalResponseDTO extends CreateOmitPassword {
  id: string;
  userStatus: ProfessionalUserStatus;
}

type CreateOmitPassword = Omit<CreateProfessionalDTO, "password">;

const DOCUMENT_TYPES: ProfessionalDocumentType[] = [
  "CEDULA",
  "TARJETA_IDENTIDAD",
  "PASAPORTE",
  "CEDULA_EXTRANJERIA",
];
const SPECIALTIES: ProfessionalSpecialty[] = [
  "GENERAL_MEDICINE",
  "PEDIATRICS",
  "CARDIOLOGY",
  "GENERAL_SURGERY",
  "GYNECOLOGY",
  "DERMATOLOGY",
  "NEUROLOGY",
  "PSYCHIATRY",
  "ORTHOPEDICS",
  "OPHTHALMOLOGY",
];
const USER_STATUSES: ProfessionalUserStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
];

function isOneOf<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && values.some((item) => item === value);
}

function parseProfessionalResponse(payload: unknown): ProfessionalResponseDTO {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("id" in payload) ||
    typeof payload.id !== "string" ||
    !("firstName" in payload) ||
    typeof payload.firstName !== "string" ||
    !("lastName" in payload) ||
    typeof payload.lastName !== "string" ||
    !("documentType" in payload) ||
    !isOneOf(DOCUMENT_TYPES, payload.documentType) ||
    !("documentNumber" in payload) ||
    typeof payload.documentNumber !== "string" ||
    !("phone" in payload) ||
    typeof payload.phone !== "string" ||
    !("email" in payload) ||
    typeof payload.email !== "string" ||
    !("specialty" in payload) ||
    !isOneOf(SPECIALTIES, payload.specialty) ||
    !("medicalLicense" in payload) ||
    typeof payload.medicalLicense !== "string" ||
    !("institution" in payload) ||
    typeof payload.institution !== "string" ||
    !("userStatus" in payload) ||
    !isOneOf(USER_STATUSES, payload.userStatus)
  ) {
    throw new Error(
      "El backend devolvió una respuesta de profesional inválida.",
    );
  }

  return {
    id: payload.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    documentType: payload.documentType,
    documentNumber: payload.documentNumber,
    phone: payload.phone,
    email: payload.email,
    specialty: payload.specialty,
    medicalLicense: payload.medicalLicense,
    institution: payload.institution,
    userStatus: payload.userStatus,
  };
}

export function createProfessional(
  professional: CreateProfessionalDTO,
): Promise<ProfessionalResponseDTO> {
  return apiRequest("professional", parseProfessionalResponse, {
    method: "POST",
    body: JSON.stringify(professional),
  });
}
