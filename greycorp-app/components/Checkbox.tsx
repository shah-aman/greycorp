import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onValueChange: (value: boolean) => void;
}

export function Checkbox({ label, checked, onValueChange }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onValueChange(!checked)}
      activeOpacity={0.7}>
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
        {checked && <Check size={14} color={Colors.bg} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing * 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Layout.radii.sm / 2,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  label: {
    ...Fonts.body,
    color: Colors.text,
  },
});