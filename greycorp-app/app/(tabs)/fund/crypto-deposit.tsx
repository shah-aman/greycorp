import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, Copy, QrCode } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function CryptoDepositScreen() {
  const [copied, setCopied] = useState(false);
  
  // Mock deposit address
  const depositAddress = '0x1234...5678';
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Deposit USDC</Text>
      <Text style={styles.subtitle}>Send USDC to the following address</Text>
      
      <View style={styles.qrContainer}>
        <QrCode size={200} color={Colors.text} />
      </View>
      
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Deposit Address</Text>
        <View style={styles.addressBox}>
          <Text style={styles.address}>{depositAddress}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Copy size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {copied && <Text style={styles.copiedText}>Address copied!</Text>}
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Important Information</Text>
        <Text style={styles.infoText}>
          • Only send USDC on Ethereum network{'\n'}
          • Minimum deposit: 10 USDC{'\n'}
          • Deposits are typically credited within 5-10 minutes
        </Text>
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
  qrContainer: {
    alignItems: 'center',
    backgroundColor: Colors.bg,
    padding: Layout.spacing * 5,
    borderRadius: Layout.radii.md,
    marginBottom: Layout.spacing * 6,
    ...Layout.shadow.md,
  },
  addressContainer: {
    marginBottom: Layout.spacing * 6,
  },
  addressLabel: {
    ...Fonts.body,
    marginBottom: Layout.spacing * 2,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
  },
  address: {
    ...Fonts.body,
    flex: 1,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copiedText: {
    ...Fonts.caption,
    color: Colors.secondary,
    marginTop: Layout.spacing * 2,
  },
  infoBox: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
  },
  infoTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 3,
  },
  infoText: {
    ...Fonts.body,
    color: Colors.textLight,
    lineHeight: 24,
  },
});