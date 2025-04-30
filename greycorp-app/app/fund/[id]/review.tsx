import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CircleCheck as CheckCircle2 } from 'lucide-react-native';
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

export default function ReviewScreen() {
  const { id, amount } = useLocalSearchParams();
  const [fund, setFund] = useState(mockFunds.find(f => f.id === id) || mockFunds[0]);
  const [submitting, setSubmitting] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  
  const investmentAmount = parseFloat(amount as string) || 0;
  const sharesCount = investmentAmount / fund.pricePerShare;
  const networkFee = 2.50; // Mock network fee
  const totalAmount = investmentAmount + networkFee;
  
  const handleConfirm = () => {
    setSubmitting(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setSubmitting(false);
      setTransactionComplete(true);
      
      // Navigate to success screen after a brief delay
      setTimeout(() => {
        router.push(`/fund/${id}/success?amount=${amount}`);
      }, 1000);
    }, 2000);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          disabled={submitting || transactionComplete}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Review Investment</Text>
        <Text style={styles.subtitle}>Confirm your investment details</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fund</Text>
            <Text style={styles.summaryValue}>{fund.name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Investment Amount</Text>
            <Text style={styles.summaryValue}>${investmentAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shares</Text>
            <Text style={styles.summaryValue}>{sharesCount.toFixed(4)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Share Price</Text>
            <Text style={styles.summaryValue}>${fund.pricePerShare.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Network Fee</Text>
            <Text style={styles.summaryValue}>${networkFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            By tapping "Sign & Submit" you agree to the fund's terms and conditions, including the prospectus and fee disclosure.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {transactionComplete ? (
          <View style={styles.successContainer}>
            <CheckCircle2 size={24} color={Colors.secondary} />
            <Text style={styles.successText}>Transaction submitted</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, submitting && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={Colors.bg} size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>Sign & Submit</Text>
            )}
          </TouchableOpacity>
        )}
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
  summaryCard: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 5,
    marginBottom: Layout.spacing * 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing * 3,
  },
  summaryLabel: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  summaryValue: {
    ...Fonts.body,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: Layout.spacing * 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing * 3,
  },
  totalLabel: {
    ...Fonts.h3,
  },
  totalValue: {
    ...Fonts.h3,
  },
  legalSection: {
    marginBottom: Layout.spacing * 6,
  },
  legalText: {
    ...Fonts.caption,
    color: Colors.textLight,
    lineHeight: 18,
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
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    ...Fonts.body,
    color: Colors.secondary,
    marginLeft: Layout.spacing * 2,
    fontWeight: '600',
  },
});