import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, Ban as Bank, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

const BANKS = [
  {
    id: 'chase',
    name: 'Chase',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'bofa',
    name: 'Bank of America',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'wells',
    name: 'Wells Fargo',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'citi',
    name: 'Citibank',
    logo: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function BankLinkScreen() {
  const handleBankSelect = (bankId: string) => {
    // In a real app, would open Plaid Link
    router.push('/fund/success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Link Your Bank</Text>
      <Text style={styles.subtitle}>Select your bank to connect your account</Text>
      
      <View style={styles.bankList}>
        {BANKS.map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={styles.bankItem}
            onPress={() => handleBankSelect(bank.id)}>
            <View style={styles.bankInfo}>
              <View style={styles.bankLogo}>
                <Bank size={24} color={Colors.primary} />
              </View>
              <Text style={styles.bankName}>{bank.name}</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.securityNote}>
        <Text style={styles.securityTitle}>Secure Connection</Text>
        <Text style={styles.securityText}>
          We use Plaid to securely connect your bank account. Your credentials are never stored on our servers.
        </Text>
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
  bankList: {
    marginBottom: Layout.spacing * 8,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 3,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 3,
  },
  bankName: {
    ...Fonts.body,
    fontWeight: '600',
  },
  securityNote: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
  },
  securityTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 2,
  },
  securityText: {
    ...Fonts.body,
    color: Colors.textLight,
  },
});