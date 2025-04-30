import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Filter } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';
import { TransactionItem } from '@/components/TransactionItem';

// Mock data
const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    fundName: 'Real Estate Trust',
    date: '2024-02-15',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 1200,
    fundName: 'Fixed Income Fund',
    date: '2024-02-10',
  },
  {
    id: '3',
    type: 'interest',
    amount: 125.45,
    fundName: 'Private Credit Fund',
    date: '2024-02-01',
  },
  {
    id: '4',
    type: 'deposit',
    amount: 3000,
    fundName: 'Fixed Income Fund',
    date: '2024-01-25',
  },
  {
    id: '5',
    type: 'interest',
    amount: 87.32,
    fundName: 'Real Estate Trust',
    date: '2024-01-15',
  },
  {
    id: '6',
    type: 'withdrawal',
    amount: 500,
    fundName: 'Private Credit Fund',
    date: '2024-01-05',
  },
  {
    id: '7',
    type: 'deposit',
    amount: 10000,
    fundName: 'Real Estate Trust',
    date: '2023-12-20',
  },
];

export default function ActivityScreen() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredTransactions = filterType
    ? transactions.filter(t => t.type === filterType)
    : transactions;
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Activity</Text>
      
      <View style={styles.filterRow}>
        <Text style={styles.subtitle}>Transaction History</Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filterType === null && styles.activeFilterChip]}
            onPress={() => setFilterType(null)}>
            <Text
              style={[styles.filterChipText, filterType === null && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'deposit' && styles.activeFilterChip]}
            onPress={() => setFilterType('deposit')}>
            <Text
              style={[styles.filterChipText, filterType === 'deposit' && styles.activeFilterText]}>
              Deposits
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'withdrawal' && styles.activeFilterChip]}
            onPress={() => setFilterType('withdrawal')}>
            <Text
              style={[styles.filterChipText, filterType === 'withdrawal' && styles.activeFilterText]}>
              Withdrawals
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'interest' && styles.activeFilterChip]}
            onPress={() => setFilterType('interest')}>
            <Text
              style={[styles.filterChipText, filterType === 'interest' && styles.activeFilterText]}>
              Interest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Filter size={64} color={Colors.textLight} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No transactions found</Text>
      <Text style={styles.emptyMessage}>
        {filterType 
          ? `There are no ${filterType} transactions to display.` 
          : 'There are no transactions to display yet.'}
      </Text>
      {filterType && (
        <TouchableOpacity style={styles.clearFilterButton} onPress={() => setFilterType(null)}>
          <Text style={styles.clearFilterText}>Clear Filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Layout.spacing * 5,
    paddingTop: Layout.spacing * 15,
    paddingBottom: Layout.spacing * 5,
  },
  title: {
    ...Fonts.h1,
    marginBottom: Layout.spacing * 4,
  },
  subtitle: {
    ...Fonts.h3,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing * 4,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: Layout.spacing * 4,
  },
  filterChip: {
    paddingHorizontal: Layout.spacing * 3,
    paddingVertical: Layout.spacing,
    backgroundColor: Colors.bgAlt,
    borderRadius: 20,
    marginLeft: Layout.spacing * 2,
    marginBottom: Layout.spacing * 2,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    ...Fonts.caption,
    color: Colors.text,
  },
  activeFilterText: {
    color: Colors.bg,
  },
  listContent: {
    paddingHorizontal: Layout.spacing * 5,
    paddingBottom: Layout.spacing * 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Layout.spacing * 20,
    paddingHorizontal: Layout.spacing * 5,
  },
  emptyIcon: {
    marginBottom: Layout.spacing * 4,
    opacity: 0.5,
  },
  emptyTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 2,
  },
  emptyMessage: {
    ...Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Layout.spacing * 6,
  },
  clearFilterButton: {
    paddingVertical: Layout.spacing * 3,
    paddingHorizontal: Layout.spacing * 6,
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
  },
  clearFilterText: {
    ...Fonts.body,
    color: Colors.primary,
  },
});