import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Copy, LockKeyhole } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function WalletSetupScreen() {
  const [mode, setMode] = useState<'New Wallet' | 'Import'>('New Wallet');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletReady, setWalletReady] = useState(false);
  const [generatedPhrase, setGeneratedPhrase] = useState('');
  
  const generateWallet = () => {
    // Simulate generating a new wallet with a seed phrase
    const mockSeedPhrase = 'museum echo sadness deposit vacant silent car logic sleep dawn vintage castle';
    setGeneratedPhrase(mockSeedPhrase);
    setWalletReady(true);
  };
  
  const handleImport = () => {
    // In a real app, we would validate the seed phrase
    if (seedPhrase.trim().split(' ').length === 12) {
      setWalletReady(true);
    }
  };
  
  const handleContinue = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet Setup</Text>
          <Text style={styles.subtitle}>
            Create a new wallet or import an existing one
          </Text>
        </View>
        
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, mode === 'New Wallet' && styles.segmentActive]}
            onPress={() => setMode('New Wallet')}>
            <Text
              style={[styles.segmentText, mode === 'New Wallet' && styles.segmentTextActive]}>
              New Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, mode === 'Import' && styles.segmentActive]}
            onPress={() => setMode('Import')}>
            <Text
              style={[styles.segmentText, mode === 'Import' && styles.segmentTextActive]}>
              Import
            </Text>
          </TouchableOpacity>
        </View>
        
        {mode === 'New Wallet' ? (
          <View style={styles.newWalletContainer}>
            {generatedPhrase ? (
              <View style={styles.seedPhraseContainer}>
                <View style={styles.seedPhraseHeader}>
                  <Text style={styles.seedPhraseTitle}>Your Seed Phrase</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={() => {}}>
                    <Copy size={16} color={Colors.primary} />
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.seedPhraseContent}>
                  <Text style={styles.seedPhraseWarning}>
                    Write down these 12 words in order and keep them safe. They are the only way to recover your wallet.
                  </Text>
                  
                  <View style={styles.phraseGrid}>
                    {generatedPhrase.split(' ').map((word, index) => (
                      <View key={index} style={styles.wordContainer}>
                        <Text style={styles.wordNumber}>{index + 1}</Text>
                        <Text style={styles.word}>{word}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.securityNote}>
                  <LockKeyhole size={20} color={Colors.primary} />
                  <Text style={styles.securityText}>
                    Never share your seed phrase with anyone
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.generateButton} onPress={generateWallet}>
                <Text style={styles.generateButtonText}>Generate Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.importContainer}>
            <Text style={styles.inputLabel}>Enter your 12-word seed phrase</Text>
            <View style={styles.textAreaContainer}>
              <Text 
                style={styles.textArea}
                onPress={() => setSeedPhrase('museum echo sadness deposit vacant silent car logic sleep dawn vintage castle')}>
                {seedPhrase || 'Tap to enter seed phrase...'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.importButton, !seedPhrase && styles.buttonDisabled]} 
              onPress={handleImport}
              disabled={!seedPhrase}>
              <Text style={styles.importButtonText}>Import Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.continueButton, !walletReady && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!walletReady}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
  },
  header: {
    marginTop: Layout.spacing * 10,
    marginBottom: Layout.spacing * 8,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 2,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing * 8,
    borderRadius: Layout.radii.sm,
    backgroundColor: Colors.bgAlt,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: Layout.spacing * 3,
    alignItems: 'center',
    borderRadius: Layout.radii.sm - 2,
  },
  segmentActive: {
    backgroundColor: Colors.bg,
    ...Layout.shadow.md,
  },
  segmentText: {
    ...Fonts.body,
    color: Colors.textLight,
  },
  segmentTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  newWalletContainer: {
    flex: 1,
    marginBottom: Layout.spacing * 6,
  },
  importContainer: {
    flex: 1,
    marginBottom: Layout.spacing * 6,
  },
  inputLabel: {
    ...Fonts.body,
    marginBottom: Layout.spacing * 2,
  },
  textAreaContainer: {
    height: 180,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    borderRadius: Layout.radii.sm,
    padding: Layout.spacing * 4,
    marginBottom: Layout.spacing * 6,
  },
  textArea: {
    ...Fonts.body,
    color: Colors.text,
    height: '100%',
  },
  importButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    alignItems: 'center',
  },
  importButtonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    alignItems: 'center',
    marginTop: Layout.spacing * 4,
  },
  generateButtonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  continueButtonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  seedPhraseContainer: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 5,
    marginTop: Layout.spacing * 4,
  },
  seedPhraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing * 5,
  },
  seedPhraseTitle: {
    ...Fonts.h3,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    ...Fonts.caption,
    marginLeft: Layout.spacing,
    color: Colors.primary,
  },
  seedPhraseContent: {
    marginBottom: Layout.spacing * 5,
  },
  seedPhraseWarning: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 5,
  },
  phraseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing * 3,
    backgroundColor: Colors.bg,
    borderRadius: Layout.radii.sm,
    paddingVertical: Layout.spacing * 2,
    paddingHorizontal: Layout.spacing * 3,
  },
  wordNumber: {
    ...Fonts.caption,
    color: Colors.textLight,
    marginRight: Layout.spacing,
  },
  word: {
    ...Fonts.body,
    color: Colors.text,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: Layout.spacing * 3,
    borderRadius: Layout.radii.sm,
  },
  securityText: {
    ...Fonts.body,
    marginLeft: Layout.spacing * 2,
    color: Colors.primary,
  },
});