import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  textAreaFocused: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
});
