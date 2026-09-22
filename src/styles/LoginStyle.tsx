import { StyleSheet } from 'react-native';
import { colors } from './ColorsStyle';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    // Elevación Android
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMedium,
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#FAFAFA',
  },
  inputWrapperFocused: {
    borderColor: colors.border,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  iconPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
