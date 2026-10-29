import { Feather } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/RegistrationFeedbackModalStyle";

interface RegistrationFeedbackModalProps {
  type: "error" | "success";
  message: string;
  title?: string;
  onClose: () => void;
}

export function RegistrationFeedbackModal({
  type,
  message,
  title,
  onClose,
}: RegistrationFeedbackModalProps) {
  const isSuccess = type === "success";

  return (
    <Modal
      visible={Boolean(message)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          accessibilityViewIsModal
          style={styles.card}
        >
          <View
            style={[
              styles.iconWrapper,
              isSuccess ? styles.successIconWrapper : styles.errorIconWrapper,
            ]}
          >
            <Feather
              name={isSuccess ? "check" : "x"}
              size={32}
              color={isSuccess ? "#16A34A" : "#DC2626"}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <Text accessibilityRole="alert" style={styles.title}>
            {title ?? (isSuccess ? "Registro exitoso" : "No se pudo registrar")}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={[
              styles.button,
              isSuccess ? styles.successButton : styles.errorButton,
            ]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
