import { Feather } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { SelectField } from "../SelectField";
import { styles } from "../../styles/PermissionsStyle";

interface AccessGrantFiltersProps {
  searchQuery: string;
  status: string;
  statusOptions: { label: string; value: string }[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function AccessGrantFilters({
  searchQuery,
  status,
  statusOptions,
  onSearchChange,
  onStatusChange,
}: AccessGrantFiltersProps) {
  return (
    <View style={styles.filterCard}>
      <View style={styles.searchWrapper}>
        <Feather
          name="search"
          size={16}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar profesional, paciente..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <SelectField
        value={status}
        placeholder="Todos los estados"
        options={statusOptions}
        onSelect={onStatusChange}
      />
    </View>
  );
}
