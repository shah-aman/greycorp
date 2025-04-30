import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function DepositSuccessScreen() {
  const handleContinue = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={88} color={Colors.secondary} />
        </View>
        
        <Text style={styles.title}>Deposit Successful!</Text>
        <Text style={styles.message}>
          Your deposit has been initiated and will be credited to your account shortly.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: Layout.spacing * 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    backgroundColor: 'rgba(59, 178, 115, 0.1)',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing * 6,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 4,
    textAlign: 'center',
  },
  message: {
    ...Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Layout.spacing * 8,
    maxWidth: '90%',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
});