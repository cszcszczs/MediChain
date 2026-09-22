import { StyleSheet } from 'react-native';
import { colors } from './ColorsStyle';

export const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMedium,
    marginBottom: 6,
  },
  required: {
    color: colors.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: colors.inputBg,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    paddingVertical: 0,
  },
});
