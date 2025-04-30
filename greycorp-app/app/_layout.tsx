import React, { useEffect } from 'react';
import { Stack, SplashScreen, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated Screens
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="fund/[id]" options={{ presentation: 'modal' }} />
            {/* wallet-setup might be part of initial auth flow or settings? */}
            {/* <Stack.Screen name="wallet-setup" /> */}
             {/* Add other authenticated screens here */}
          </>
        ) : (
          // Unauthenticated Screens
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" options={{ presentation: 'modal' }} />
             {/* Welcome screen can be removed or accessed differently if needed */}
             {/* <Stack.Screen name="welcome" /> */}
          </>
        )}
         {/* Common Screens */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}