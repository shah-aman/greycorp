import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function PaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };
  
  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };
  
  const handleSubmit = () => {
    // In a real app, would handle payment processing
    router.push('/fund/success');
  };
  
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiry.length === 5 &&
      cvv.length === 3 &&
      name.length > 0
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Add Payment Method</Text>
      <Text style={styles.subtitle}>Enter your card details</Text>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <CreditCard size={24} color={Colors.text} />
          <Text style={styles.cardType}>Credit/Debit Card</Text>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>
        
        <View style={styles.row}>
          <View style={[styles.formField, { flex: 1, marginRight: Layout.spacing * 2 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={[styles.formField, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.label}>Name on Card</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="JOHN SMITH"
            autoCapitalize="characters"
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid() && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid()}>
          <Text style={styles.submitButtonText}>Add Card</Text>
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
  content: {
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
  card: {
    backgroundColor: Colors.bgAlt,
    borderRadius: Layout.radii.md,
    padding: Layout.spacing * 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing * 6,
  },
  cardType: {
    ...Fonts.h3,
    marginLeft: Layout.spacing * 2,
  },
  formField: {
    marginBottom: Layout.spacing * 4,
  },
  label: {
    ...Fonts.caption,
    marginBottom: Layout.spacing * 2,
  },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: Layout.radii.sm,
    paddingHorizontal: Layout.spacing * 4,
    paddingVertical: Layout.spacing * 3,
    ...Fonts.body,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Layout.spacing * 4,
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
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  submitButtonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
});