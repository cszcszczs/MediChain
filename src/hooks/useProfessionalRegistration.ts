import { useCallback, useState } from "react";
import { createProfessional } from "../services/professionals";
import {
  prepareProfessionalRegistration,
  ProfessionalFormValues,
} from "../utils/professionalForm";

const INITIAL_VALUES: ProfessionalFormValues = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  telefono: "",
  correoElectronico: "",
  especialidad: "",
  licenciaMedica: "",
  institucion: "",
  password: "",
  confirmPassword: "",
};

export function useProfessionalRegistration() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = useCallback(
    (field: keyof ProfessionalFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrorMessage("");
      setSuccessMessage("");
    },
    [],
  );

  const clearFeedback = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const submit = useCallback(async () => {
    const registration = prepareProfessionalRegistration(values);
    if (!registration.success) {
      setErrorMessage(registration.error);
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const createdProfessional = await createProfessional(registration.data);
      setSuccessMessage(
        `Profesional ${createdProfessional.firstName} ${createdProfessional.lastName} registrado correctamente.`,
      );
      setValues((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al registrar al profesional.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return {
    values,
    updateField,
    isSubmitting,
    errorMessage,
    successMessage,
    submit,
    clearFeedback,
  };
}
