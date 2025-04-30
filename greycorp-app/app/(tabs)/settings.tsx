import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const handleLogout = () => {
    // In a real app, would handle logout logic
    router.replace('/welcome');
  };
  
  const SettingRow = ({ icon, title, onPress, hasToggle, toggleValue, onToggleChange }: any) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={hasToggle}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      
      {hasToggle ? (
        <Switch
          trackColor={{ false: Colors.bgAlt, true: Colors.secondary }}
          thumbColor={Colors.bg}
          ios_backgroundColor={Colors.bgAlt}
          onValueChange={onToggleChange}
          value={toggleValue}
        />
      ) : (
        <ChevronRight size={20} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingRow
          icon={<User size={20} color={Colors.primary} />}
          title="Profile Information"
          onPress={() => {}}
        />
        
        <SettingRow
          icon={<CreditCard size={20} color={Colors.primary} />}
          title="Payment Methods"
          onPress={() => {}}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingRow
          icon={<Bell size={20} color={Colors.primary} />}
          title="Notifications"
          hasToggle
          toggleValue={notificationsEnabled}
          onToggleChange={setNotificationsEnabled}
        />
        
        <SettingRow
          icon={<Moon size={20} color={Colors.primary} />}
          title="Dark Mode"
          hasToggle
          toggleValue={darkModeEnabled}
          onToggleChange={setDarkModeEnabled}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <SettingRow
          icon={<Shield size={20} color={Colors.primary} />}
          title="Change Password"
          onPress={() => {}}
        />
        
        <SettingRow
          icon={<Shield size={20} color={Colors.primary} />}
          title="Biometric Authentication"
          hasToggle
          toggleValue={biometricsEnabled}
          onToggleChange={setBiometricsEnabled}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingRow
          icon={<HelpCircle size={20} color={Colors.primary} />}
          title="Help Center"
          onPress={() => {}}
        />
        
        <SettingRow
          icon={<HelpCircle size={20} color={Colors.primary} />}
          title="Contact Support"
          onPress={() => {}}
        />
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingBottom: Layout.spacing * 10,
  },
  header: {
    paddingHorizontal: Layout.spacing * 5,
    paddingTop: Layout.spacing * 15,
    paddingBottom: Layout.spacing * 5,
  },
  title: {
    ...Fonts.h1,
    marginBottom: Layout.spacing * 4,
  },
  section: {
    paddingHorizontal: Layout.spacing * 5,
    marginBottom: Layout.spacing * 6,
  },
  sectionTitle: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg,
    paddingVertical: Layout.spacing * 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgAlt,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 3,
  },
  settingTitle: {
    ...Fonts.body,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing * 4,
    marginHorizontal: Layout.spacing * 5,
    marginBottom: Layout.spacing * 6,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Layout.radii.md,
  },
  logoutText: {
    ...Fonts.body,
    color: Colors.danger,
    marginLeft: Layout.spacing * 2,
  },
  versionText: {
    ...Fonts.caption,
    color: Colors.textLight,
    textAlign: 'center',
  },
});