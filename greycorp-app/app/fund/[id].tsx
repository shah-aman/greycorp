import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

// Mock function to get fund details by ID
const getMockFundDetails = (id: string) => {
  const funds = [
    {
      id: '1',
      name: 'Fixed Income Fund',
      apy: 0.048,
      description: 'Low-risk fund focusing on stable returns through bonds and fixed-income securities.',
      minInvestment: 100,
      themeColor: Colors.cardPastel1,
    },
    {
      id: '2',
      name: 'Real Estate Trust',
      apy: 0.062,
      description: 'Invest in a diversified portfolio of income-generating real estate properties.',
      minInvestment: 500,
      themeColor: Colors.cardPastel2,
    },
    {
      id: '3',
      name: 'Private Credit',
      apy: 0.058,
      description: 'Access opportunities in private lending with potentially higher yields.',
      minInvestment: 1000,
      themeColor: Colors.cardPastel3,
    },
  ];
  return funds.find(f => f.id === id);
};

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { balance, invest } = useAuth();
  const [fund, setFund] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const details = getMockFundDetails(id);
      if (details) {
        setFund(details);
      } else {
        Alert.alert('Error', 'Fund details not found.');
        router.back();
      }
    }
  }, [id]);

  const handleInvest = async () => {
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to invest.');
      return;
    }
    if (amount > balance) {
      Alert.alert('Insufficient Balance', `Your current balance is $${balance.toFixed(2)}. Please deposit more funds.`);
      return;
    }
    if (fund && amount < fund.minInvestment) {
       Alert.alert('Minimum Investment', `The minimum investment for this fund is $${fund.minInvestment}.`);
       return;
    }

    if (!fund || !id) {
      Alert.alert('Error', 'Fund details are missing.');
      return; 
    }

    setLoading(true);
    const success = await invest(id, fund.name, amount);
    setLoading(false);

    if (success) {
      Alert.alert('Investment Successful', `You have invested $${amount.toFixed(2)} into ${fund?.name}.`);
      setInvestAmount('');
      router.back();
    } else {
      Alert.alert('Investment Failed', 'Could not complete the investment.');
    }
  };

  if (!fund) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={Colors.primary} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: fund.name }} /> 

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={[styles.header, { backgroundColor: fund.themeColor }]}>
         <Text style={styles.fundName}>{fund.name}</Text>
         <Text style={styles.fundAPY}>{(fund.apy * 100).toFixed(1)}% APY (Est.)</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{fund.description}</Text>

        <Text style={styles.sectionTitle}>Investment Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Your Balance</Text>
          <Text style={styles.detailValue}>${balance.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Minimum Investment</Text>
          <Text style={styles.detailValue}>${fund.minInvestment}</Text>
        </View>

        <Text style={styles.sectionTitle}>Invest Now</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={investAmount}
            onChangeText={setInvestAmount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.investButton, loading && styles.buttonDisabled]} 
          onPress={handleInvest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.bg} />
          ) : (
            <Text style={styles.investButtonText}>Invest</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: Layout.spacing * 20,
  },
  backButton: {
    position: 'absolute',
    top: Layout.spacing * 15,
    left: Layout.spacing * 5,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: Layout.spacing * 2,
    borderRadius: 100,
  },
  header: {
    height: 200,
    justifyContent: 'flex-end',
    padding: Layout.spacing * 5,
  },
  fundName: {
    ...Fonts.h1,
    color: Colors.text, // Ensure contrast
    marginBottom: Layout.spacing,
  },
  fundAPY: {
    ...Fonts.h3,
    color: Colors.text, // Ensure contrast
    opacity: 0.8,
  },
  content: {
    padding: Layout.spacing * 5,
  },
  sectionTitle: {
    ...Fonts.h3,
    marginTop: Layout.spacing * 6,
    marginBottom: Layout.spacing * 3,
  },
  description: {
    ...Fonts.body,
    color: Colors.textLight,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing * 3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgAlt,
  },
  detailLabel: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  detailValue: {
    ...Fonts.body,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 6,
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
  investButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  investButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
});