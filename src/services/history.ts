import type { DocumentPickerAsset } from "expo-document-picker";
import { apiRequest } from "./api";

export interface CreateHistoryDTO {
  patientId: string;
  consultationDate: string;
  symptoms?: string;
  diagnosis: string;
  treatment: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  medications?: {
    name: string;
    dose: string;
    frequency: string;
  }[];
  exams?: {
    name: string;
    performedAt: string;
    status: "PENDING" | "COMPLETED";
    result?: string;
  }[];
  notes?: string;
}

export interface HistoryResponseDTO {
  id: string;
  patientId: string;
  professionalId: string;
  consultationDate: string;
  symptoms: string | null;
  diagnosis: string;
  treatment: string;
  bloodPressure: string | null;
  heartRate: number | null;
  temperature: number | null;
  weight: number | null;
  notes: string | null;
  medications: {
    id: string;
    name: string;
    dose: string;
    frequency: string;
  }[];
  exams: {
    id: string;
    name: string;
    performedAt: string;
    status: "PENDING" | "COMPLETED";
    result: string | null;
  }[];
  attachments: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  }[];
  createdAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === "number";
}

function parseMedication(
  value: unknown,
): HistoryResponseDTO["medications"][number] | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.dose !== "string" ||
    typeof value.frequency !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    dose: value.dose,
    frequency: value.frequency,
  };
}

function parseExam(value: unknown): HistoryResponseDTO["exams"][number] | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.performedAt !== "string" ||
    (value.status !== "PENDING" && value.status !== "COMPLETED") ||
    !isNullableString(value.result)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    performedAt: value.performedAt,
    status: value.status,
    result: value.result,
  };
}

function parseAttachment(
  value: unknown,
): HistoryResponseDTO["attachments"][number] | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.originalName !== "string" ||
    typeof value.mimeType !== "string" ||
    typeof value.sizeBytes !== "number" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    originalName: value.originalName,
    mimeType: value.mimeType,
    sizeBytes: value.sizeBytes,
    createdAt: value.createdAt,
  };
}

function parseHistoryResponse(payload: unknown): HistoryResponseDTO {
  if (
    !isRecord(payload) ||
    typeof payload.id !== "string" ||
    typeof payload.patientId !== "string" ||
    typeof payload.professionalId !== "string" ||
    typeof payload.consultationDate !== "string" ||
    !isNullableString(payload.symptoms) ||
    typeof payload.diagnosis !== "string" ||
    typeof payload.treatment !== "string" ||
    !isNullableString(payload.bloodPressure) ||
    !isNullableNumber(payload.heartRate) ||
    !isNullableNumber(payload.temperature) ||
    !isNullableNumber(payload.weight) ||
    !isNullableString(payload.notes) ||
    !Array.isArray(payload.medications) ||
    !Array.isArray(payload.exams) ||
    !Array.isArray(payload.attachments) ||
    typeof payload.createdAt !== "string"
  ) {
    throw new Error("El backend devolvió una respuesta de historial inválida.");
  }

  const medications = payload.medications.map(parseMedication);
  const exams = payload.exams.map(parseExam);
  const attachments = payload.attachments.map(parseAttachment);
  const validMedications = medications.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  const validExams = exams.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  const validAttachments = attachments.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  if (
    validMedications.length !== medications.length ||
    validExams.length !== exams.length ||
    validAttachments.length !== attachments.length
  ) {
    throw new Error("El backend devolvió datos incompletos en el historial.");
  }

  return {
    id: payload.id,
    patientId: payload.patientId,
    professionalId: payload.professionalId,
    consultationDate: payload.consultationDate,
    symptoms: payload.symptoms,
    diagnosis: payload.diagnosis,
    treatment: payload.treatment,
    bloodPressure: payload.bloodPressure,
    heartRate: payload.heartRate,
    temperature: payload.temperature,
    weight: payload.weight,
    notes: payload.notes,
    medications: validMedications,
    exams: validExams,
    attachments: validAttachments,
    createdAt: payload.createdAt,
  };
}

function getAttachmentMimeType(asset: DocumentPickerAsset): string | null {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (asset.mimeType) {
    return allowedTypes.includes(asset.mimeType) ? asset.mimeType : null;
  }

  const extension = asset.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return null;
  }
}

async function createHistoryFormData(
  data: CreateHistoryDTO,
  attachments: DocumentPickerAsset[],
): Promise<FormData> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  for (const asset of attachments) {
    const mimeType = getAttachmentMimeType(asset);
    if (!mimeType) {
      throw new Error(`El archivo "${asset.name}" tiene un formato no permitido.`);
    }

    if (asset.size !== undefined && asset.size > 10 * 1024 * 1024) {
      throw new Error(`El archivo "${asset.name}" supera el límite de 10 MB.`);
    }

    if (asset.file) {
      formData.append("attachments", asset.file);
    } else {
      const nativeFormData = formData as FormData & {
        append(
          name: string,
          value: { uri: string; name: string; type: string },
        ): void;
      };
      nativeFormData.append("attachments", {
        uri: asset.uri,
        name: asset.name,
        type: mimeType,
      });
    }
  }

  return formData;
}

export async function createHistory(
  data: CreateHistoryDTO,
  attachments: DocumentPickerAsset[],
): Promise<HistoryResponseDTO> {
  if (attachments.length > 5) {
    throw new Error("Puedes adjuntar un máximo de 5 archivos.");
  }

  const formData = await createHistoryFormData(data, attachments);
  return apiRequest("history", parseHistoryResponse, {
    method: "POST",
    body: formData,
  });
}
