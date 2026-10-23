import { apiRequest } from "./api";

export type PatientDocumentType =
  | "CEDULA"
  | "TARJETA_IDENTIDAD"
  | "PASAPORTE"
  | "CEDULA_EXTRANJERIA";

export type PatientGender = "MASCULINO" | "FEMENINO" | "OTRO";

export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  documentType: PatientDocumentType;
  documentNumber: string;
  birthDate: string;
  gender: PatientGender;
  email: string;
  phone: string;
  city: string;
  address: string;
  password: string;
}

export interface PatientResponseDTO {
  id: string;
  name: string;
  documentNumber: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

function parsePatientResponse(payload: unknown): PatientResponseDTO {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("id" in payload) ||
    typeof payload.id !== "string" ||
    !("name" in payload) ||
    typeof payload.name !== "string" ||
    !("documentNumber" in payload) ||
    typeof payload.documentNumber !== "string" ||
    !("email" in payload) ||
    typeof payload.email !== "string" ||
    !("phone" in payload) ||
    typeof payload.phone !== "string" ||
    !("city" in payload) ||
    typeof payload.city !== "string" ||
    !("address" in payload) ||
    typeof payload.address !== "string"
  ) {
    throw new Error("El backend devolvió una respuesta de paciente inválida.");
  }

  return {
    id: payload.id,
    name: payload.name,
    documentNumber: payload.documentNumber,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    address: payload.address,
  };
}

export function createPatient(
  patient: CreatePatientDTO,
): Promise<PatientResponseDTO> {
  return apiRequest("patient", parsePatientResponse, {
    method: "POST",
    body: JSON.stringify(patient),
  });
}
