import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleCheck as CheckCircle, Copy, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function SuccessScreen() {
  const { id, amount } = useLocalSearchParams();
  const investmentAmount = parseFloat(amount as string) || 0;
  
  // Mock transaction hash
  const txHash = '0x3a8d409df9e8d4f8b0b3b3f9c0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0';
  
  const handleViewPortfolio = () => {
    router.replace('/');
  };
  
  const handleCopyTxHash = () => {
    // In a real app, would use Clipboard API
    alert('Transaction hash copied to clipboard');
  };
  
  const handleViewExplorer = () => {
    // In a real app, would open block explorer
    alert('Opening block explorer');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={88} color={Colors.secondary} />
        </View>
        
        <Text style={styles.title}>Investment Successful!</Text>
        
        <Text style={styles.message}>
          Your investment of ${investmentAmount.toFixed(2)} is on the way! 
          The transaction has been submitted to the blockchain and will be confirmed shortly.
        </Text>
        
        <View style={styles.transactionCard}>
          <Text style={styles.transactionLabel}>Transaction Hash</Text>
          <View style={styles.hashContainer}>
            <Text style={styles.hash} numberOfLines={1} ellipsizeMode="middle">
              {txHash}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyTxHash}>
              <Copy size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.explorerButton} onPress={handleViewExplorer}>
            <Text style={styles.explorerButtonText}>View on Block Explorer</Text>
            <ExternalLink size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.portfolioButton} onPress={handleViewPortfolio}>
          <Text style={styles.portfolioButtonText}>View Portfolio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing * 5,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(59, 178, 115, 0.1)',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing * 6,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 4,
    textAlign: 'center',
  },
  message: {
    ...Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Layout.spacing * 8,
    maxWidth: '90%',
  },
  transactionCard: {
    backgroundColor: Colors.bgAlt,
    width: '100%',
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 8,
  },
  transactionLabel: {
    ...Fonts.caption,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 2,
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing * 4,
  },
  hash: {
    ...Fonts.body,
    flex: 1,
    marginRight: Layout.spacing * 2,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing * 2,
  },
  explorerButtonText: {
    ...Fonts.body,
    color: Colors.primary,
    marginRight: Layout.spacing * 2,
  },
  portfolioButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    alignItems: 'center',
    width: '100%',
  },
  portfolioButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
});