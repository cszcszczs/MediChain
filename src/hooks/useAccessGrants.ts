import { useCallback, useEffect, useState } from "react";
import {
  acceptAccessGrant,
  AccessGrantResponseDTO,
  createAccessGrant,
  CreateAccessGrantDTO,
  listAccessGrants,
  revokeAccessGrant,
} from "../services/accessGrants";

export function useAccessGrants() {
  const [grants, setGrants] = useState<AccessGrantResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setGrants(await listAccessGrants());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar las autorizaciones.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    listAccessGrants()
      .then((result) => {
        if (isMounted) {
          setGrants(result);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las autorizaciones.",
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

  const runAction = useCallback(
    async (action: () => Promise<void>) => {
      setIsUpdating(true);
      setError("");

      try {
        await action();
        await refresh();
        return true;
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo actualizar la autorización.",
        );
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [refresh],
  );

  const create = useCallback(
    (grant: CreateAccessGrantDTO) =>
      runAction(() => createAccessGrant(grant)),
    [runAction],
  );

  const accept = useCallback(
    (id: string) => runAction(() => acceptAccessGrant(id)),
    [runAction],
  );

  const revoke = useCallback(
    (id: string) => runAction(() => revokeAccessGrant(id)),
    [runAction],
  );

  return { grants, isLoading, isUpdating, error, refresh, create, accept, revoke };
}
