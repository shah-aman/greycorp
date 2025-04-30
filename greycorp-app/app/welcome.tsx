import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      
      <Image 
        source={require('@/assets/images/icon.png')} 
        style={styles.logo} 
      />
      
      <Text style={styles.tagline}>Invest smarter, together.</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/signup')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => router.push('/login' as any)}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    padding: Layout.spacing * 5,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.cardPastel2,
    opacity: 0.05,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: Layout.radii.lg,
    marginBottom: Layout.spacing * 8, 
  },
  tagline: {
    ...Fonts.h2,
    textAlign: 'center',
    marginBottom: Layout.spacing * 16, 
    color: Colors.text,
    maxWidth: '80%',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    ...Layout.shadow.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: Layout.spacing * 4, 
  },
  buttonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
  loginButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Layout.spacing * 4,
  },
  loginButtonText: {
    color: Colors.primary,
    ...Fonts.body,
    fontWeight: '600',
  },
});