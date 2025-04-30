import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function KYCScreen() {
  const handleStartKYC = () => {
    router.push('/kyc/document');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Identity Verification</Text>
        
        <Text style={styles.subtitle}>
          To comply with regulations, we need to verify your identity before you can start investing.
        </Text>
        
        <View style={styles.stepsContainer}>
          <StepItem 
            number={1} 
            title="ID Document" 
            description="Prepare a government-issued ID (passport, driver's license)" 
          />
          <StepItem 
            number={2} 
            title="Take Photos" 
            description="We'll guide you to take clear photos of your ID" 
          />
          <StepItem 
            number={3} 
            title="Selfie Verification" 
            description="A quick selfie to match with your ID" 
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleStartKYC}>
          <Text style={styles.buttonText}>Start Verification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

function StepItem({ number, title, description }: StepItemProps) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
  },
  backButton: {
    marginTop: Layout.spacing * 10,
    marginBottom: Layout.spacing * 5,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 4,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 8,
  },
  stepsContainer: {
    marginVertical: Layout.spacing * 6,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing * 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 4,
  },
  stepNumberText: {
    ...Fonts.body,
    color: Colors.bg,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing,
  },
  stepDescription: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    marginTop: Layout.spacing * 6,
    ...Layout.shadow.md,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
});