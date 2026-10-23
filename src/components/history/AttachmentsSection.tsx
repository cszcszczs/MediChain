import { Feather } from "@expo/vector-icons";
import type { DocumentPickerAsset } from "expo-document-picker";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/HistoryStyle";

interface AttachmentsSectionProps {
  attachments: DocumentPickerAsset[];
  isSubmitting: boolean;
  onPick: () => void;
  onRemove: (uri: string) => void;
}

export function AttachmentsSection({
  attachments,
  isSubmitting,
  onPick,
  onRemove,
}: AttachmentsSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.cardIconWrapper}>
            <Feather name="upload" size={16} color="#2563EB" />
          </View>
          <Text style={styles.cardTitle}>Archivos Adjuntos</Text>
        </View>
        <TouchableOpacity onPress={onPick} disabled={isSubmitting}>
          <Text style={styles.addLink}>↑ Subir</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.uploadBox}
        activeOpacity={0.7}
        onPress={onPick}
        disabled={isSubmitting || attachments.length >= 5}
      >
        <Feather name="upload-cloud" size={22} color="#9CA3AF" />
        <Text style={styles.uploadText}>
          {attachments.length >= 5
            ? "Límite de 5 archivos alcanzado"
            : `Toca "Subir" para adjuntar archivos (${attachments.length}/5)`}
        </Text>
      </TouchableOpacity>
      {attachments.map((file) => (
        <View key={file.uri} style={styles.attachedFileRow}>
          <View style={styles.attachedFileInfo}>
            <Feather name="paperclip" size={14} color="#6B7280" />
            <Text style={styles.attachedFileName} numberOfLines={1}>
              {file.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onRemove(file.uri)}
            disabled={isSubmitting}
          >
            <Text style={styles.removeLink}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
