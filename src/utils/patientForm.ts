import {
  CreatePatientDTO,
  PatientDocumentType,
  PatientGender,
} from "../services/patients";

export const DOCUMENT_TYPES = [
  "Cédula",
  "Tarjeta de Identidad",
  "Pasaporte",
  "Cédula de Extranjería",
];

export const GENDERS = ["Masculino", "Femenino", "Otro"];

const DOCUMENT_TYPE_VALUES: Record<string, PatientDocumentType> = {
  "Cédula": "CEDULA",
  "Tarjeta de Identidad": "TARJETA_IDENTIDAD",
  "Pasaporte": "PASAPORTE",
  "Cédula de Extranjería": "CEDULA_EXTRANJERIA",
};

const GENDER_VALUES: Record<string, PatientGender> = {
  Masculino: "MASCULINO",
  Femenino: "FEMENINO",
  Otro: "OTRO",
};

export interface PatientFormValues {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: string;
  correoElectronico: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  password: string;
  confirmPassword: string;
}

export type PatientFormResult =
  | { success: true; data: CreatePatientDTO }
  | { success: false; error: string };

export function preparePatientRegistration(
  values: PatientFormValues,
): PatientFormResult {
  const patient: CreatePatientDTO = {
    firstName: values.nombres.trim(),
    lastName: values.apellidos.trim(),
    documentType: DOCUMENT_TYPE_VALUES[values.tipoDocumento],
    documentNumber: values.numeroDocumento.trim(),
    birthDate: values.fechaNacimiento.trim(),
    gender: GENDER_VALUES[values.genero],
    email: values.correoElectronico.trim(),
    phone: values.telefono.trim(),
    city: values.ciudad.trim(),
    address: values.direccion.trim(),
    password: values.password,
  };

  const validationError = validatePatientForm(patient, values.confirmPassword);
  if (validationError) {
    return { success: false, error: validationError };
  }

  return { success: true, data: patient };
}

function validatePatientForm(
  patient: CreatePatientDTO,
  confirmPassword: string,
): string | null {
  if (!patient.firstName || !patient.lastName) {
    return "Ingresa los nombres y apellidos del paciente.";
  }
  if (!patient.documentType || !patient.gender) {
    return "Selecciona el tipo de documento y el género.";
  }
  if (patient.documentNumber.length < 5) {
    return "El número de documento debe tener al menos 5 caracteres.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(patient.birthDate)) {
    return "La fecha de nacimiento debe tener el formato AAAA-MM-DD.";
  }

  const [year, month, day] = patient.birthDate.split("-").map(Number);
  const birthDate = new Date(Date.UTC(year, month - 1, day));
  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() !== month - 1 ||
    birthDate.getUTCDate() !== day
  ) {
    return "Ingresa una fecha de nacimiento válida.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
    return "Ingresa un correo electrónico válido.";
  }
  if (patient.phone.length < 7) {
    return "El teléfono debe tener al menos 7 caracteres.";
  }
  if (!patient.city || !patient.address) {
    return "La ciudad y la dirección son obligatorias.";
  }
  if (patient.password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (patient.password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return null;
}
