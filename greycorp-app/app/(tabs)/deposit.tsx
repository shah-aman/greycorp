import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function DepositScreen() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { deposit } = useAuth();

  const handleDepositPress = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to deposit.');
      return;
    }

    // Simulate showing a temporary deposit address
    const tempAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'; // Example temporary address

    Alert.alert(
      'Deposit Instructions',
      `This is a temporary deposit address. Please send exactly ${depositAmount.toFixed(2)} USD to the following address:\n\n${tempAddress}\n\nOnce the transaction is confirmed, your balance will be updated.`, 
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'I Have Sent It',
          onPress: async () => {
            setLoading(true);
            // Simulate confirmation delay
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            try {
              await deposit(depositAmount);
              Alert.alert('Deposit Confirmed', 'Your balance has been updated.');
              router.push('/(tabs)'); // Navigate back to home/main tab
            } catch (error) {
              Alert.alert('Deposit Failed', 'Something went wrong while updating your balance.');
            } finally {
              setLoading(false);
              setAmount('');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>
      <Text style={styles.subtitle}>Enter the amount you wish to deposit.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleDepositPress} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.bg} />
        ) : (
          <Text style={styles.buttonText}>Show Deposit Address</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
    paddingTop: Layout.spacing * 20, // Add padding to avoid overlap with potential header
  },
  title: {
    ...Fonts.h1,
    marginBottom: Layout.spacing * 2,
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Layout.spacing * 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 8,
  },
  currencySymbol: {
    ...Fonts.h1,
    marginRight: Layout.spacing * 2,
    color: Colors.textLight,
  },
  input: {
    flex: 1,
    ...Fonts.h1,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  buttonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
}); 