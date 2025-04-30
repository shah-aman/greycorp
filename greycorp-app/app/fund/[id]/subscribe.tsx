import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

// Mock data
const mockFunds = [
  {
    id: '1',
    name: 'Fixed Income Fund',
    apy: 0.048,
    minInvestment: 1000,
    pricePerShare: 10.25,
    themeColor: Colors.cardPastel1,
  },
  {
    id: '2',
    name: 'Real Estate Trust',
    apy: 0.062,
    minInvestment: 5000,
    pricePerShare: 25.75,
    themeColor: Colors.cardPastel2,
  },
  {
    id: '3',
    name: 'Private Credit Fund',
    apy: 0.078,
    minInvestment: 10000,
    pricePerShare: 50.50,
    themeColor: Colors.cardPastel3,
  },
];

export default function SubscribeScreen() {
  const { id } = useLocalSearchParams();
  const [fund, setFund] = useState(mockFunds.find(f => f.id === id) || mockFunds[0]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const handleAmountChange = (text: string) => {
    setAmount(text);
    
    // Validate minimum investment
    const numAmount = parseFloat(text);
    if (isNaN(numAmount)) {
      setError('Please enter a valid number');
    } else if (numAmount < fund.minInvestment) {
      setError(`Minimum investment is $${fund.minInvestment.toLocaleString()}`);
    } else {
      setError('');
    }
  };
  
  const getShareCount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount / fund.pricePerShare;
  };
  
  const handleContinue = () => {
    router.push(`/fund/${id}/review?amount=${amount}`);
  };
  
  const isValid = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount >= fund.minInvestment && error === '';
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Invest in {fund.name}</Text>
        <Text style={styles.subtitle}>Enter the amount you want to invest</Text>
        
        <View style={styles.card}>
          <View style={[styles.colorBar, { backgroundColor: fund.themeColor }]} />
          
          <View style={styles.cardContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textLight}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.shareCount}>
                ≈ {getShareCount().toFixed(4)} shares at ${fund.pricePerShare.toFixed(2)}/share
              </Text>
            )}
            
            <TouchableOpacity style={styles.maxButton}>
              <Text style={styles.maxButtonText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Investment Details</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fund</Text>
            <Text style={styles.infoValue}>{fund.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>APY</Text>
            <Text style={styles.infoValue}>{(fund.apy * 100).toFixed(1)}%</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Minimum</Text>
            <Text style={styles.infoValue}>${fund.minInvestment.toLocaleString()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price per Share</Text>
            <Text style={styles.infoValue}>${fund.pricePerShare.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !isValid() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid()}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight size={20} color={Colors.bg} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    padding: Layout.spacing * 5,
    paddingBottom: Layout.spacing * 20,
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
  card: {
    backgroundColor: Colors.bg,
    borderRadius: Layout.radii.md,
    marginBottom: Layout.spacing * 6,
    ...Layout.shadow.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 12,
  },
  cardContent: {
    flex: 1,
    padding: Layout.spacing * 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing * 2,
  },
  currencySymbol: {
    ...Fonts.h1,
    marginRight: Layout.spacing,
  },
  amountInput: {
    flex: 1,
    ...Fonts.h1,
    color: Colors.text,
    paddingVertical: Layout.spacing * 2,
  },
  shareCount: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  errorText: {
    ...Fonts.body,
    color: Colors.danger,
  },
  maxButton: {
    position: 'absolute',
    top: Layout.spacing * 4,
    right: Layout.spacing * 4,
    backgroundColor: Colors.bgAlt,
    paddingHorizontal: Layout.spacing * 3,
    paddingVertical: Layout.spacing * 1,
    borderRadius: Layout.radii.sm,
  },
  maxButtonText: {
    ...Fonts.caption,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
  },
  infoTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing * 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  infoValue: {
    ...Fonts.body,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  continueButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
    marginRight: Layout.spacing * 2,
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
});