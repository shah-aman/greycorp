import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';
import { useAuth } from '@/contexts/AuthContext';

interface FundCardProps {
  fund: {
    id: string;
    name: string;
    apy: number;
    themeColor: string;
  };
}

export function FundCard({ fund }: FundCardProps) {
  const { getFundInvestment } = useAuth();
  const investedAmount = getFundInvestment(fund.id);
  
  const handlePress = () => {
    router.push(`/fund/${fund.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: fund.themeColor }]}
      onPress={handlePress}>
      <View style={styles.topSection}>
        <View style={styles.expiry}>
          <Text style={styles.expiryLabel}>{(fund.apy * 100).toFixed(1)}%</Text>
          <View style={styles.divider} />
          <View style={styles.dateContainer}>
            <Text style={styles.expiryValue}>APY</Text>
            <Text style={styles.expiryMonth}>(Est.)</Text>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${investedAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</Text>
        </View>
      </View>
      
      <View style={styles.bottomSection}>
        <View style={styles.cardHolderContainer}>
          <Text style={styles.cardHolderLabel}>Invested</Text>
          <Text style={styles.cardHolderName}>{fund.name}</Text>
        </View>
        
        <View style={styles.cardDetailsContainer}>
          <Text style={styles.bankName}>Min Invest.</Text>
          <Text style={styles.cardNumber}>$100</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginRight: Layout.spacing * 4,
    ...Layout.shadow.card,
  } as ViewStyle,
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing * 6,
  } as ViewStyle,
  expiry: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  } as ViewStyle,
  expiryLabel: {
    ...Fonts.subcaption,
    color: Colors.text,
    marginBottom: Layout.spacing,
    fontWeight: '600',
  } as TextStyle,
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.textLight,
    opacity: 0.6,
    marginBottom: Layout.spacing,
  } as ViewStyle,
  dateContainer: {
    flexDirection: 'column',
  } as ViewStyle,
  expiryValue: {
    ...Fonts.h3,
    color: Colors.text,
  } as TextStyle,
  expiryMonth: {
    ...Fonts.subcaption,
    color: Colors.textLight,
  } as TextStyle,
  amountContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  amount: {
    ...Fonts.h1,
    color: Colors.text,
  } as TextStyle,
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  cardHolderContainer: {
    flexDirection: 'column',
  } as ViewStyle,
  cardHolderLabel: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing,
  } as TextStyle,
  cardHolderName: {
    ...Fonts.body,
    color: Colors.textLight,
  } as TextStyle,
  cardDetailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  } as ViewStyle,
  bankName: {
    ...Fonts.body,
    color: Colors.text,
    marginBottom: Layout.spacing,
  } as TextStyle,
  cardNumber: {
    ...Fonts.body,
    color: Colors.text,
  } as TextStyle,
});