import { useCallback, useEffect, useState } from "react";
import {
  listProfessionals,
  ProfessionalResponseDTO,
} from "../services/professionals";

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<
    ProfessionalResponseDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setProfessionals(await listProfessionals());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los profesionales.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    listProfessionals()
      .then((result) => {
        if (isMounted) {
          setProfessionals(result);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar los profesionales.",
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

  return { professionals, isLoading, error, refresh };
}
