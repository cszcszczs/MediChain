import type { DocumentPickerAsset } from "expo-document-picker";
import { CreateHistoryDTO } from "../services/history";

export interface HistoryFormValues {
  patientId: string;
  consultationDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  medications: { id: number; nombre: string; dosis: string; frecuencia: string }[];
  exams: { id: number; nombre: string; resultado: string }[];
  notes: string;
}

export type HistoryFormResult =
  | { success: true; data: CreateHistoryDTO }
  | { success: false; error: string };

function parseOptionalNumber(
  value: string,
  fieldLabel: string,
): { value?: number; error?: string } {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) {
    return {};
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { error: `${fieldLabel} debe ser un número mayor que cero.` };
  }

  return { value: parsed };
}

function toIsoDateTime(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return `${date}T12:00:00.000Z`;
}

export function prepareHistory(
  values: HistoryFormValues,
  attachments: DocumentPickerAsset[],
): HistoryFormResult {
  if (!values.patientId) {
    return { success: false, error: "Selecciona un paciente." };
  }

  const consultationDate = toIsoDateTime(values.consultationDate.trim());
  if (!consultationDate) {
    return {
      success: false,
      error: "La fecha de consulta debe ser válida y tener formato AAAA-MM-DD.",
    };
  }
  if (!values.diagnosis.trim()) {
    return { success: false, error: "El diagnóstico es obligatorio." };
  }
  if (!values.treatment.trim()) {
    return { success: false, error: "El tratamiento es obligatorio." };
  }
  if (attachments.length > 5) {
    return { success: false, error: "Puedes adjuntar un máximo de 5 archivos." };
  }

  const heartRate = parseOptionalNumber(values.heartRate, "La frecuencia cardíaca");
  const temperature = parseOptionalNumber(values.temperature, "La temperatura");
  const weight = parseOptionalNumber(values.weight, "El peso");
  const numberError = heartRate.error ?? temperature.error ?? weight.error;
  if (numberError) {
    return { success: false, error: numberError };
  }
  if (heartRate.value !== undefined && !Number.isInteger(heartRate.value)) {
    return {
      success: false,
      error: "La frecuencia cardíaca debe ser un número entero.",
    };
  }
  if (heartRate.value !== undefined && heartRate.value > 300) {
    return {
      success: false,
      error: "La frecuencia cardíaca no puede superar 300 bpm.",
    };
  }
  if (temperature.value !== undefined && temperature.value > 100) {
    return {
      success: false,
      error: "La temperatura no puede superar 100 °C.",
    };
  }
  if (weight.value !== undefined && weight.value > 1000) {
    return { success: false, error: "El peso no puede superar 1000 kg." };
  }
  if (values.bloodPressure.trim().length > 30) {
    return {
      success: false,
      error: "La presión arterial no puede superar 30 caracteres.",
    };
  }

  const medications = values.medications
    .map((item) => ({
      name: item.nombre.trim(),
      dose: item.dosis.trim(),
      frequency: item.frecuencia.trim(),
    }))
    .filter((item) => item.name || item.dose || item.frequency);
  if (medications.some((item) => !item.name || !item.dose || !item.frequency)) {
    return {
      success: false,
      error: "Completa nombre, dosis y frecuencia en cada medicamento.",
    };
  }
  if (medications.some((item) =>
    item.name.length > 200 || item.dose.length > 200 || item.frequency.length > 200
  )) {
    return {
      success: false,
      error: "Los datos de cada medicamento no pueden superar 200 caracteres.",
    };
  }
  if (medications.length > 50) {
    return { success: false, error: "Puedes registrar hasta 50 medicamentos." };
  }

  const exams = values.exams
    .map((item) => ({
      name: item.nombre.trim(),
      result: item.resultado.trim(),
    }))
    .filter((item) => item.name || item.result);
  if (exams.some((item) => !item.name)) {
    return {
      success: false,
      error: "Ingresa el nombre de cada examen que tenga un resultado.",
    };
  }
  if (exams.some((item) => item.name.length > 200 || item.result.length > 10000)) {
    return {
      success: false,
      error: "El nombre o resultado de un examen supera el límite permitido.",
    };
  }
  if (exams.length > 50) {
    return { success: false, error: "Puedes registrar hasta 50 exámenes." };
  }
  if (values.symptoms.trim().length > 5000 || values.notes.trim().length > 10000) {
    return {
      success: false,
      error: "Los síntomas o las notas superan el límite de caracteres.",
    };
  }

  return {
    success: true,
    data: {
      patientId: values.patientId,
      consultationDate,
      diagnosis: values.diagnosis.trim(),
      treatment: values.treatment.trim(),
      ...(values.symptoms.trim() && { symptoms: values.symptoms.trim() }),
      ...(values.bloodPressure.trim() && {
        bloodPressure: values.bloodPressure.trim(),
      }),
      ...(heartRate.value !== undefined && { heartRate: heartRate.value }),
      ...(temperature.value !== undefined && { temperature: temperature.value }),
      ...(weight.value !== undefined && { weight: weight.value }),
      ...(medications.length > 0 && { medications }),
      ...(exams.length > 0 && {
        exams: exams.map((exam) => ({
          name: exam.name,
          performedAt: consultationDate,
          status: "COMPLETED" as const,
          ...(exam.result && { result: exam.result }),
        })),
      }),
      ...(values.notes.trim() && { notes: values.notes.trim() }),
    },
  };
}
