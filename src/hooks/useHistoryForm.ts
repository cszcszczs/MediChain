import { useCallback, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import type { DocumentPickerAsset } from "expo-document-picker";
import { createHistory } from "../services/history";
import { prepareHistory } from "../utils/historyForm";
import { usePatients } from "./usePatients";

export interface MedicationFormEntry {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
}

export interface ExamFormEntry {
  id: number;
  nombre: string;
  resultado: string;
}

let nextId = 1;
const generateId = () => nextId++;

export function useHistoryForm() {
  const {
    patients,
    isLoading: isLoadingPatients,
    error: patientError,
    refresh,
    clearError: clearPatientError,
  } = usePatients();
  const [patientId, setPatientId] = useState("");
  const [consultationDate, setConsultationDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medications, setMedications] = useState<MedicationFormEntry[]>([
    { id: generateId(), nombre: "", dosis: "", frecuencia: "" },
  ]);
  const [exams, setExams] = useState<ExamFormEntry[]>([]);
  const [attachments, setAttachments] = useState<DocumentPickerAsset[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addMedication = useCallback(() => {
    setMedications((current) => [
      ...current,
      { id: generateId(), nombre: "", dosis: "", frecuencia: "" },
    ]);
  }, []);

  const updateMedication = useCallback(
    (
      id: number,
      field: "nombre" | "dosis" | "frecuencia",
      value: string,
    ) => {
      setMedications((current) =>
        current.map((medication) =>
          medication.id === id
            ? { ...medication, [field]: value }
            : medication,
        ),
      );
    },
    [],
  );

  const removeMedication = useCallback((id: number) => {
    setMedications((current) =>
      current.filter((medication) => medication.id !== id),
    );
  }, []);

  const addExam = useCallback(() => {
    setExams((current) => [
      ...current,
      { id: generateId(), nombre: "", resultado: "" },
    ]);
  }, []);

  const updateExam = useCallback(
    (id: number, field: "nombre" | "resultado", value: string) => {
      setExams((current) =>
        current.map((exam) =>
          exam.id === id ? { ...exam, [field]: value } : exam,
        ),
      );
    },
    [],
  );

  const removeExam = useCallback((id: number) => {
    setExams((current) => current.filter((exam) => exam.id !== id));
  }, []);

  const pickAttachments = useCallback(async () => {
    setErrorMessage("");

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (attachments.length + result.assets.length > 5) {
        setErrorMessage("Puedes adjuntar un máximo de 5 archivos.");
        return;
      }

      const oversizedFile = result.assets.find(
        (asset) => asset.size !== undefined && asset.size > 10 * 1024 * 1024,
      );
      if (oversizedFile) {
        setErrorMessage(
          `El archivo "${oversizedFile.name}" supera el límite de 10 MB.`,
        );
        return;
      }

      setAttachments((current) => [...current, ...result.assets]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron seleccionar los archivos.",
      );
    }
  }, [attachments.length]);

  const removeAttachment = useCallback((uri: string) => {
    setAttachments((current) => current.filter((file) => file.uri !== uri));
  }, []);

  const clearFeedback = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const submit = useCallback(async () => {
    const form = prepareHistory(
      {
        patientId,
        consultationDate,
        symptoms,
        diagnosis,
        treatment,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        medications,
        exams,
        notes,
      },
      attachments,
    );

    if (!form.success) {
      setErrorMessage(form.error);
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createHistory(form.data, attachments);
      setSuccessMessage("El historial clínico se guardó correctamente.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al guardar el historial.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    attachments,
    bloodPressure,
    consultationDate,
    diagnosis,
    exams,
    heartRate,
    medications,
    notes,
    patientId,
    symptoms,
    temperature,
    treatment,
    weight,
  ]);

  return {
    patients,
    isLoadingPatients,
    patientError,
    refreshPatients: refresh,
    clearPatientError,
    patientId,
    setPatientId,
    consultationDate,
    setConsultationDate,
    bloodPressure,
    setBloodPressure,
    heartRate,
    setHeartRate,
    temperature,
    setTemperature,
    weight,
    setWeight,
    symptoms,
    setSymptoms,
    diagnosis,
    setDiagnosis,
    treatment,
    setTreatment,
    medications,
    addMedication,
    updateMedication,
    removeMedication,
    exams,
    addExam,
    updateExam,
    removeExam,
    attachments,
    pickAttachments,
    removeAttachment,
    notes,
    setNotes,
    isSubmitting,
    errorMessage,
    successMessage,
    clearFeedback,
    submit,
  };
}
