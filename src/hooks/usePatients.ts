import { useCallback, useEffect, useState } from "react";
import { listPatients, PatientResponseDTO } from "../services/patients";

export function usePatients() {
  const [patients, setPatients] = useState<PatientResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await listPatients();
      setPatients(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los pacientes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    listPatients()
      .then((result) => {
        if (isMounted) {
          setPatients(result);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar los pacientes.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { patients, isLoading, error, refresh };
}
