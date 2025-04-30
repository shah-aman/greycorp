import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={Colors.textLight}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing * 5,
  },
  label: {
    ...Fonts.body,
    marginBottom: Layout.spacing * 2,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    borderRadius: Layout.radii.sm,
    paddingHorizontal: Layout.spacing * 4,
    paddingVertical: Layout.spacing * 3,
    ...Fonts.body,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    ...Fonts.caption,
    color: Colors.danger,
    marginTop: Layout.spacing,
  },
});