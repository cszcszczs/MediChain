import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(17, 24, 39, 0.55)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    marginBottom: 16,
  },
  errorIconWrapper: {
    backgroundColor: "#FEE2E2",
  },
  successIconWrapper: {
    backgroundColor: "#DCFCE7",
  },
  title: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },
  button: {
    minWidth: 128,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  errorButton: {
    backgroundColor: "#DC2626",
  },
  successButton: {
    backgroundColor: "#16A34A",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
