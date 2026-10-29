import { ActivityIndicator, Text, View } from "react-native";
import { AccessGrantResponseDTO } from "../../services/accessGrants";
import { styles } from "../../styles/PermissionsStyle";
import { AccessGrantCard } from "./AccessGrantCard";

interface AccessGrantListProps {
  grants: AccessGrantResponseDTO[];
  isLoading: boolean;
  isUpdating: boolean;
  canAccept: boolean;
  hasActiveFilters: boolean;
  onAccept: (id: string) => void;
  onRevoke: (id: string) => void;
}

export function AccessGrantList({
  grants,
  isLoading,
  isUpdating,
  canAccept,
  hasActiveFilters,
  onAccept,
  onRevoke,
}: AccessGrantListProps) {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  if (grants.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyStateBox}>
          <Text style={styles.emptyStateText}>
            {hasActiveFilters
              ? "No se encontraron permisos con esos filtros"
              : "No hay autorizaciones registradas"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {grants.map((grant) => (
        <AccessGrantCard
          key={grant.id}
          grant={grant}
          isUpdating={isUpdating}
          canAccept={canAccept}
          onAccept={onAccept}
          onRevoke={onRevoke}
        />
      ))}
    </>
  );
}
