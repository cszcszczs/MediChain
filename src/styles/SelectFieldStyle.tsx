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
    justifyContent: 'space-between',
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
  selectValue: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  placeholderText: {
    flex: 1,
    fontSize: 14,
    color: colors.placeholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
    paddingVertical: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalOptionText: {
    fontSize: 14,
    color: colors.textMedium,
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
