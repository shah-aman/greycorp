import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Basic password field for demo
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }
    try {
      await signup(username);
      // Navigation will be handled by the RootLayout based on isAuthenticated
      // router.replace('/(tabs)'); // Or explicitly navigate if needed
    } catch (error) {
      Alert.alert('Signup Failed', 'Could not create account.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/login' as any)}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
  },
  title: {
    ...Fonts.h1,
    textAlign: 'center',
    marginBottom: Layout.spacing * 10,
  },
  input: {
    backgroundColor: Colors.bgAlt,
    paddingHorizontal: Layout.spacing * 4,
    paddingVertical: Layout.spacing * 3,
    borderRadius: Layout.radii.sm,
    marginBottom: Layout.spacing * 4,
    ...Fonts.body,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    borderRadius: Layout.radii.md,
    alignItems: 'center',
    marginBottom: Layout.spacing * 4,
  },
  buttonText: {
    ...Fonts.h3,
    color: Colors.bg,
  },
  linkText: {
    ...Fonts.body,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Layout.spacing * 2,
  },
});