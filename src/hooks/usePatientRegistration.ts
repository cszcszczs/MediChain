import { useCallback, useState } from "react";
import { createPatient } from "../services/patients";
import {
  PatientFormValues,
  preparePatientRegistration,
} from "../utils/patientForm";

const INITIAL_VALUES: PatientFormValues = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  fechaNacimiento: "",
  genero: "",
  correoElectronico: "",
  telefono: "",
  ciudad: "",
  direccion: "",
  password: "",
  confirmPassword: "",
};

export function usePatientRegistration() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = useCallback(
    (field: keyof PatientFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrorMessage("");
      setSuccessMessage("");
    },
    [],
  );

  const submit = useCallback(async () => {
    const registration = preparePatientRegistration(values);
    if (!registration.success) {
      setErrorMessage(registration.error);
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const createdPatient = await createPatient(registration.data);
      setSuccessMessage(
        `Paciente ${createdPatient.name} registrado correctamente.`,
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
          : "Ocurrió un error inesperado al registrar al paciente.",
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
  };
}
