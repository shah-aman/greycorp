import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';
import { MarketplaceFundCard } from '@/components/MarketplaceFundCard';

// Mock data
const mockFunds = [
  {
    id: '1',
    name: 'Fixed Income Fund',
    description: 'Stable income with government and corporate bonds',
    apy: 0.048,
    minInvestment: 1000,
    risk: 2,
    category: 'Fixed-Income',
    themeColor: Colors.cardPastel1,
  },
  {
    id: '2',
    name: 'Real Estate Trust',
    description: 'Commercial real estate portfolio with quarterly distributions',
    apy: 0.062,
    minInvestment: 5000,
    risk: 3,
    category: 'Real-Estate',
    themeColor: Colors.cardPastel2,
  },
  {
    id: '3',
    name: 'Private Credit Fund',
    description: 'Direct lending to mid-sized businesses',
    apy: 0.078,
    minInvestment: 10000,
    risk: 4,
    category: 'Private Credit',
    themeColor: Colors.cardPastel3,
  },
  {
    id: '4',
    name: 'Digital Asset Income',
    description: 'Yield from staking and lending digital assets',
    apy: 0.085,
    minInvestment: 2000,
    risk: 5,
    category: 'Fixed-Income',
    themeColor: Colors.cardPastel1,
  },
  {
    id: '5',
    name: 'Residential REIT',
    description: 'Multi-family residential properties portfolio',
    apy: 0.053,
    minInvestment: 2500,
    risk: 3,
    category: 'Real-Estate',
    themeColor: Colors.cardPastel2,
  },
];

const categories = [
  'All',
  'Fixed-Income', 
  'Real-Estate', 
  'Private Credit'
];

export default function MarketplaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredFunds = mockFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          fund.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || fund.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Discover investment opportunities</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search funds..."
            placeholderTextColor={Colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredFunds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MarketplaceFundCard fund={item} />}
        contentContainerStyle={styles.fundsList}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: Colors.bg,
  },
  title: {
    ...Fonts.h1,
    marginBottom: Layout.spacing,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    paddingHorizontal: Layout.spacing * 4,
    marginBottom: Layout.spacing * 5,
  },
  searchIcon: {
    marginRight: Layout.spacing * 2,
  },
  searchInput: {
    ...Fonts.body,
    flex: 1,
    color: Colors.text,
    paddingVertical: Layout.spacing * 3,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingBottom: Layout.spacing * 3,
  },
  categoryChip: {
    paddingHorizontal: Layout.spacing * 4,
    paddingVertical: Layout.spacing * 2,
    borderRadius: 20,
    marginRight: Layout.spacing * 2,
    backgroundColor: Colors.bgAlt,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    ...Fonts.body,
    color: Colors.text,
  },
  categoryChipTextSelected: {
    color: Colors.bg,
  },
  fundsList: {
    paddingHorizontal: Layout.spacing * 5,
    paddingTop: Layout.spacing * 2,
    paddingBottom: Layout.spacing * 20,
  },
});