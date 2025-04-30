import React from 'react';
import { Tabs } from 'expo-router';
import { Home, DollarSign, Activity, BarChart2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopWidth: 1,
          borderTopColor: Colors.bgAlt,
          height: 55,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deposit"
        options={{
          title: 'Deposit',
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fund/[id]"
        options={{
          title: 'Fund',
          href: null,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}