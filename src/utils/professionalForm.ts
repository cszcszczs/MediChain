import {
  CreateProfessionalDTO,
  ProfessionalSpecialty,
} from "../services/professionals";

export const PROFESSIONAL_SPECIALTIES = [
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

const SPECIALTY_VALUES: Record<string, ProfessionalSpecialty> = {
  "Medicina General": "GENERAL_MEDICINE",
  Pediatría: "PEDIATRICS",
  Cardiología: "CARDIOLOGY",
  "Cirugía General": "GENERAL_SURGERY",
  Ginecología: "GYNECOLOGY",
  Dermatología: "DERMATOLOGY",
  Neurología: "NEUROLOGY",
  Psiquiatría: "PSYCHIATRY",
  Ortopedia: "ORTHOPEDICS",
  Oftalmología: "OPHTHALMOLOGY",
};

export const PROFESSIONAL_DOCUMENT_TYPES = [
  "Cédula",
  "Tarjeta de Identidad",
  "Pasaporte",
  "Cédula de Extranjería",
];

const DOCUMENT_TYPE_VALUES: Record<
  string,
  CreateProfessionalDTO["documentType"]
> = {
  "Cédula": "CEDULA",
  "Tarjeta de Identidad": "TARJETA_IDENTIDAD",
  "Pasaporte": "PASAPORTE",
  "Cédula de Extranjería": "CEDULA_EXTRANJERIA",
};

export interface ProfessionalFormValues {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico: string;
  especialidad: string;
  licenciaMedica: string;
  institucion: string;
  password: string;
  confirmPassword: string;
}

export type ProfessionalFormResult =
  | { success: true; data: CreateProfessionalDTO }
  | { success: false; error: string };

export function prepareProfessionalRegistration(
  values: ProfessionalFormValues,
): ProfessionalFormResult {
  const professional: CreateProfessionalDTO = {
    firstName: values.nombres.trim(),
    lastName: values.apellidos.trim(),
    documentType: DOCUMENT_TYPE_VALUES[values.tipoDocumento],
    documentNumber: values.numeroDocumento.trim(),
    phone: values.telefono.trim(),
    email: values.correoElectronico.trim(),
    specialty: SPECIALTY_VALUES[values.especialidad],
    medicalLicense: values.licenciaMedica.trim(),
    institution: values.institucion.trim(),
    password: values.password,
  };

  const validationError = validateProfessionalForm(
    professional,
    values.confirmPassword,
  );
  if (validationError) {
    return { success: false, error: validationError };
  }

  return { success: true, data: professional };
}

function validateProfessionalForm(
  professional: CreateProfessionalDTO,
  confirmPassword: string,
): string | null {
  if (!professional.firstName || !professional.lastName) {
    return "Ingresa los nombres y apellidos del profesional.";
  }
  if (!professional.documentType || !professional.specialty) {
    return "Selecciona el tipo de documento y la especialidad.";
  }
  if (professional.documentNumber.length < 5) {
    return "El número de documento debe tener al menos 5 caracteres.";
  }
  if (professional.phone.length < 7) {
    return "El teléfono debe tener al menos 7 caracteres.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professional.email)) {
    return "Ingresa un correo electrónico válido.";
  }
  if (!professional.medicalLicense || !professional.institution) {
    return "La licencia médica y la institución son obligatorias.";
  }
  if (professional.password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (professional.password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return null;
}
