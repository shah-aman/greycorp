import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Check, X, Loader } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

export default function PendingVerificationScreen() {
  const [status, setStatus] = useState<VerificationStatus>('pending');
  
  // Simulate verification status update
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('approved'); // Always approve for demo
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    router.push('/wallet-setup');
  };
  
  const handleRetry = () => {
    router.push('/kyc');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'pending' && (
          <>
            <View style={styles.loaderContainer}>
              <Loader size={64} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Verifying your identity</Text>
            <Text style={styles.message}>
              Your identity verification is in progress. This may take a few moments.
            </Text>
          </>
        )}
        
        {status === 'approved' && (
          <>
            <View style={styles.statusIconContainer}>
              <Check size={64} color={Colors.secondary} />
            </View>
            <Text style={styles.title}>Verification successful!</Text>
            <Text style={styles.message}>
              Your identity has been verified successfully. You can now continue to wallet setup.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Go to Wallet Setup</Text>
            </TouchableOpacity>
          </>
        )}
        
        {status === 'rejected' && (
          <>
            <View style={[styles.statusIconContainer, styles.rejectedContainer]}>
              <X size={64} color={Colors.danger} />
            </View>
            <Text style={styles.title}>Verification failed</Text>
            <Text style={styles.message}>
              Unfortunately, we couldn't verify your identity. This could be due to image quality or information mismatch.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  loaderContainer: {
    marginBottom: Layout.spacing * 8,
  },
  statusIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 178, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing * 8,
  },
  rejectedContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 4,
    textAlign: 'center',
  },
  message: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 8,
    textAlign: 'center',
    maxWidth: '90%',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
});