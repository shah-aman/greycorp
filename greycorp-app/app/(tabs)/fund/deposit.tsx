import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard, Ban as Bank, Wallet } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

const PAYMENT_METHODS = [
  {
    id: 'card',
    title: 'Credit/Debit Card',
    subtitle: 'Instant deposit, 1.5% fee',
    icon: CreditCard,
    minAmount: 10,
    maxAmount: 10000,
  },
  {
    id: 'bank',
    title: 'Bank Transfer (ACH)',
    subtitle: '2-3 business days, no fee',
    icon: Bank,
    minAmount: 100,
    maxAmount: 50000,
  },
  {
    id: 'usdc',
    title: 'USDC',
    subtitle: 'Deposit from your crypto wallet',
    icon: Wallet,
    minAmount: 10,
    maxAmount: 1000000,
  },
];

export default function DepositScreen() {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const handleContinue = () => {
    if (selectedMethod === 'card') {
      router.push('/fund/payment');
    } else if (selectedMethod === 'bank') {
      router.push('/fund/bank-link');
    } else if (selectedMethod === 'usdc') {
      router.push('/fund/crypto-deposit');
    }
  };
  
  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    if (!selectedMethod || !amount || isNaN(numAmount)) return false;
    
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    if (!method) return false;
    
    return numAmount >= method.minAmount && numAmount <= method.maxAmount;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Deposit Funds</Text>
      <Text style={styles.subtitle}>Choose amount and payment method</Text>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Deposit</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.textLight}
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Payment Method</Text>
      
      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected,
          ]}
          onPress={() => setSelectedMethod(method.id)}>
          <View style={styles.methodIcon}>
            <method.icon size={24} color={Colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>{method.title}</Text>
            <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !isValidAmount() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValidAmount()}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
  },
  backButton: {
    marginTop: Layout.spacing * 10,
    marginBottom: Layout.spacing * 5,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 2,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 6,
  },
  amountContainer: {
    marginBottom: Layout.spacing * 8,
  },
  amountLabel: {
    ...Fonts.body,
    marginBottom: Layout.spacing * 2,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
  },
  currencySymbol: {
    ...Fonts.h1,
    marginRight: Layout.spacing * 2,
  },
  amountInput: {
    ...Fonts.h1,
    flex: 1,
    color: Colors.text,
  },
  sectionTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 4,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 3,
  },
  methodCardSelected: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 3,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    ...Fonts.body,
    fontWeight: '600',
    marginBottom: Layout.spacing,
  },
  methodSubtitle: {
    ...Fonts.caption,
    color: Colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bg,
    paddingHorizontal: Layout.spacing * 5,
    paddingVertical: Layout.spacing * 4,
    borderTopWidth: 1,
    borderTopColor: Colors.bgAlt,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  continueButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
});