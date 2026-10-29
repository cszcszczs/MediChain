import React, { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AccessGrantFilters } from "../components/permissions/AccessGrantFilters";
import { AccessGrantList } from "../components/permissions/AccessGrantList";
import { AuthorizeAccessModal } from "../components/permissions/AuthorizeAccessModal";
import { useAccessGrants } from "../hooks/useAccessGrants";
import { useAuth } from "../hooks/useAuth";
import { usePatients } from "../hooks/usePatients";
import { useProfessionals } from "../hooks/useProfessionals";
import { styles } from "../styles/PermissionsStyle";
import { formatAccessGrantStatus } from "../utils/accessGrantForm";

const ALL_STATUSES = "";

export function PermissionsScreen() {
  const { user } = useAuth();
  const {
    grants,
    isLoading: isLoadingGrants,
    isUpdating,
    error: grantsError,
    refresh: refreshGrants,
    create,
    accept,
    revoke,
  } = useAccessGrants();
  const {
    patients,
    isLoading: isLoadingPatients,
    error: patientsError,
    refresh: refreshPatients,
  } = usePatients();
  const {
    professionals,
    isLoading: isLoadingProfessionals,
    error: professionalsError,
    refresh: refreshProfessionals,
  } = useProfessionals();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [modalVisible, setModalVisible] = useState(false);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(grants.map((grant) => grant.status))];
    return [
      { label: "Todos los estados", value: ALL_STATUSES },
      ...statuses.map((status) => ({
        label: formatAccessGrantStatus(status),
        value: status,
      })),
    ];
  }, [grants]);

  const filteredGrants = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return grants.filter((grant) => {
      const matchesStatus =
        !statusFilter || grant.status === statusFilter;
      const matchesQuery =
        !query ||
        grant.professional.name.toLocaleLowerCase().includes(query) ||
        grant.patient.name.toLocaleLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [grants, searchQuery, statusFilter]);

  const isLoadingOptions = isLoadingPatients || isLoadingProfessionals;
  const userEmail = user?.email.trim().toLocaleLowerCase();
  const canAcceptGrants = Boolean(
    userEmail &&
      patients.some(
        (patient) => patient.email.trim().toLocaleLowerCase() === userEmail,
      ),
  );
  const dataErrors = [
    ...(patientsError
      ? [{ message: patientsError, retry: refreshPatients }]
      : []),
    ...(professionalsError
      ? [{ message: professionalsError, retry: refreshProfessionals }]
      : []),
    ...(grantsError ? [{ message: grantsError, retry: refreshGrants }] : []),
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Gestión de Permisos</Text>
          <TouchableOpacity
            style={styles.authorizeButton}
            activeOpacity={0.85}
            disabled={isLoadingOptions}
            onPress={() => setModalVisible(true)}
          >
            <Feather
              name="user-check"
              size={15}
              color="#FFFFFF"
              style={styles.authorizeButtonIcon}
            />
            <Text style={styles.authorizeButtonText}>Autorizar</Text>
          </TouchableOpacity>
        </View>

        {dataErrors.map(({ message, retry }) => (
          <View key={message}>
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              {message}
            </Text>
            <TouchableOpacity onPress={() => void retry()}>
              <Text style={styles.retryLink}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <AccessGrantFilters
          searchQuery={searchQuery}
          status={statusFilter}
          statusOptions={statusOptions}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />

        <AccessGrantList
          grants={filteredGrants}
          isLoading={isLoadingGrants}
          isUpdating={isUpdating}
          canAccept={canAcceptGrants}
          hasActiveFilters={Boolean(searchQuery.trim() || statusFilter)}
          onAccept={(id) => void accept(id)}
          onRevoke={(id) => void revoke(id)}
        />
      </ScrollView>

      <AuthorizeAccessModal
        visible={modalVisible}
        patients={patients}
        professionals={professionals}
        isLoading={isLoadingOptions}
        isSubmitting={isUpdating}
        error={patientsError || professionalsError || grantsError}
        onClose={() => setModalVisible(false)}
        onSubmit={create}
      />
    </SafeAreaView>
  );
}
