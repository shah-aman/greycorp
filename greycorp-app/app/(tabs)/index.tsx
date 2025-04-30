import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Plus, TrendingUp, TrendingDown, LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';
import { FundCard } from '@/components/FundCard';
import { TransactionItem } from '@/components/TransactionItem';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, TransactionType } from '@/types';

// Define the props structure expected by TransactionItem based on its usage
// (Ideally, TransactionItem would export this type)
interface ExpectedTransactionItemProps {
  id: string;
  type: 'deposit' | 'withdrawal' | 'interest'; // TransactionItem seems to handle only these
  amount: number;
  fundName: string; // Assumed required by TransactionItem
  date: string;
}

// Mock data for funds (keep for now)
const mockFundData = [
    {
      id: '1',
      name: 'Fixed Income Fund',
      apy: 0.048,
      themeColor: Colors.cardPastel1,
    },
    {
      id: '2',
      name: 'Real Estate Trust',
      apy: 0.062,
      themeColor: Colors.cardPastel2,
    },
    {
      id: '3',
      name: 'Private Credit',
      apy: 0.058,
      themeColor: Colors.cardPastel3,
    },
  ];

export default function HomeScreen() {
  const { username, balance, logout, getTransactions, getFundInvestment } = useAuth();
  const [funds] = useState(mockFundData);
  const transactions: Transaction[] = getTransactions();

  // Format balance for display
  const formattedBalance = balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [integerPart, decimalPart] = formattedBalance.split('.');

  // Calculate total invested amount (optional, could display elsewhere)
  const totalInvested = funds.reduce((sum, fund) => sum + getFundInvestment(fund.id), 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImagePlaceholder} />
            <Text style={styles.profileName}>{username || 'User'}</Text>
          </TouchableOpacity>
          <Text style={styles.profileSubtitle}>Welcome back!</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
           <LogOut size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>
          Available Balance 
        </Text>
        <Text style={styles.balanceAmount}>
          <Text style={styles.balanceCurrency}>$</Text>
          {integerPart}<Text style={styles.balanceCents}>.{decimalPart || '00'}</Text>
        </Text>
      </View>
      
      <View style={styles.cardsSection}>
        <View style={styles.cardsSectionHeader}>
          <Text style={styles.cardsSectionTitle}>Your Investments</Text>
          <Text style={styles.totalInvestedText}>Total Invested: ${totalInvested.toFixed(2)}</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}>
          {funds.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {transactions.length > 0 ? (
            transactions.map((transaction) => {
              // Only render transactions that match the expected type structure 
              // or provide defaults if TransactionItem can handle missing props.
              // This cast assumes TransactionItem might crash if `type` is 'investment' 
              // or if `fundName` is missing for types it expects.
              // A safer approach would be to filter or adapt the data first.
              if (transaction.type === 'deposit' || transaction.type === 'withdrawal' || transaction.type === 'interest') {
                return (
                  <TransactionItem 
                     key={transaction.id} 
                     transaction={transaction as ExpectedTransactionItemProps} 
                  />
                );
              }
              // Optionally render investment transactions differently or skip them
              // For demo purposes, we skip rendering 'investment' types for now
              return null; 
            })
         ) : (
            <Text style={styles.noTransactionsText}>No transactions yet.</Text>
         )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingBottom: Layout.spacing * 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.bg,
    paddingHorizontal: Layout.spacing * 5,
    paddingTop: Layout.spacing * 15,
    paddingBottom: Layout.spacing * 5,
  },
  profileSection: {
    flexDirection: 'column',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    paddingVertical: Layout.spacing * 2,
    paddingHorizontal: Layout.spacing * 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: Layout.spacing * 2,
  },
  profileImagePlaceholder: {
     width: 24,
     height: 24,
     borderRadius: 12,
     backgroundColor: Colors.primaryLight,
     marginRight: Layout.spacing * 2,
  },
  profileName: {
    ...Fonts.body,
    fontWeight: '600',
  },
  profileSubtitle: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  logoutButton: {
    padding: Layout.spacing * 2, 
  },
  balanceContainer: {
    paddingHorizontal: Layout.spacing * 5,
    marginBottom: Layout.spacing * 6,
  },
  balanceTitle: {
    ...Fonts.h3,
    color: Colors.textLight,
    marginBottom: Layout.spacing,
  },
  balanceAmount: {
    ...Fonts.h1,
  },
  balanceCurrency: {
    ...Fonts.h1,
  },
  balanceCents: {
    ...Fonts.h1,
    color: Colors.textLight,
  },
  cardsSection: {
    marginBottom: Layout.spacing * 6,
  },
  cardsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing * 5,
    marginBottom: Layout.spacing * 4,
  },
  cardsSectionTitle: {
    ...Fonts.h3,
  },
  totalInvestedText: {
     ...Fonts.caption,
     color: Colors.textLight,
  },
  cardsContainer: {
    paddingLeft: Layout.spacing * 5,
    paddingRight: Layout.spacing,
    paddingBottom: Layout.spacing * 2,
  },
  recentActivity: {
    paddingHorizontal: Layout.spacing * 5,
  },
  sectionTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 3,
  },
  noTransactionsText: {
    ...Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Layout.spacing * 5,
  },
});