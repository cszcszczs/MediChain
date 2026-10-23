import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { PermissionChip } from "../PermissionChip";
import { StatusBadge } from "../StatusBadge";
import {
  AccessGrantResponseDTO,
} from "../../services/accessGrants";
import {
  formatAccessGrantStatus,
  formatPermissionAction,
  formatProfessionalSpecialty,
} from "../../utils/accessGrantForm";
import { styles } from "../../styles/PermissionsStyle";

interface AccessGrantCardProps {
  grant: AccessGrantResponseDTO;
  isUpdating: boolean;
  onAccept: (id: string) => void;
  onRevoke: (id: string) => void;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("es", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export function AccessGrantCard({
  grant,
  isUpdating,
  onAccept,
  onRevoke,
}: AccessGrantCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.professionalInfoRow}>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.professionalName}>
              {grant.professional.name}
            </Text>
            <Text style={styles.professionalSpecialty}>
              {formatProfessionalSpecialty(grant.professional.specialty)}
            </Text>
          </View>
        </View>
        <StatusBadge status={formatAccessGrantStatus(grant.status)} />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Paciente</Text>
        <Text style={styles.infoValue}>{grant.patient.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Fecha</Text>
        <Text style={styles.infoValue}>{formatDate(grant.grantedAt)}</Text>
      </View>
      {grant.expiresAt ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Expira</Text>
          <Text style={styles.infoValue}>{formatDate(grant.expiresAt)}</Text>
        </View>
      ) : null}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Permisos</Text>
        <View style={styles.chipsWrapper}>
          {grant.actions.map((action) => (
            <PermissionChip
              key={action}
              label={formatPermissionAction(action)}
            />
          ))}
        </View>
      </View>

      {(grant.status === "PENDING" || grant.status === "ACTIVE") && (
        <>
          <View style={styles.divider} />
          {grant.status === "PENDING" ? (
            <TouchableOpacity
              style={styles.acceptButton}
              activeOpacity={0.7}
              disabled={isUpdating}
              onPress={() => onAccept(grant.id)}
            >
              <Text style={styles.acceptButtonText}>Aceptar autorización</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.revokeButton}
              activeOpacity={0.7}
              disabled={isUpdating}
              onPress={() => onRevoke(grant.id)}
            >
              <Text style={styles.revokeButtonText}>Revocar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
