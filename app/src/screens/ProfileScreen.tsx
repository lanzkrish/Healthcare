/**
 * Profile & Settings Screen
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/Card';
import { FontSize, Spacing, BorderRadius } from '../utils/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'person' as const, label: 'Edit Profile', action: () => {} },
    { icon: 'people' as const, label: user?.role === 'patient' ? 'Caregiver Access Code' : 'Link to Patient', action: () => navigation.navigate('CaregiverLink') },
    { icon: 'map' as const, label: 'Hospital Navigation', action: () => navigation.navigate('HospitalNavigation') },
    { icon: 'language' as const, label: 'Language', value: user?.language === 'en' ? 'English' : user?.language },
    { icon: 'security' as const, label: 'Privacy & Security', action: () => {} },
    { icon: 'help' as const, label: 'Help & Support', action: () => {} },
    { icon: 'info' as const, label: 'About HealPath', value: 'v1.0.0' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="person" size={36} color={colors.accentBlue} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.featureBlue }]}>
            <Text style={[styles.roleText, { color: colors.featureBlueFg }]}>
              {user?.role?.toUpperCase() || 'PATIENT'}
            </Text>
          </View>
          {user?.accessCode && (
            <View style={styles.accessCodeRow}>
              <Text style={[styles.accessLabel, { color: colors.textSecondary }]}>Access Code:</Text>
              <Text style={[styles.accessCode, { color: colors.accentBlue }]}>{user.accessCode}</Text>
            </View>
          )}
        </Card>

        {/* Notifications Toggle */}
        <Card style={styles.notifCard}>
          <View style={styles.notifRow}>
            <View style={styles.notifLeft}>
              <MaterialIcons name="notifications" size={22} color={colors.accentBlue} />
              <Text style={[styles.notifText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.accentBlue + '50' }}
              thumbColor={notificationsEnabled ? colors.accentBlue : colors.textTertiary}
            />
          </View>
        </Card>

        {/* Menu Items */}
        <Card noPadding style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.menuItem, { borderBottomColor: i < menuItems.length - 1 ? colors.border : 'transparent' }]}
              onPress={item.action}>
              <MaterialIcons name={item.icon} size={22} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              {item.value ? (
                <Text style={[styles.menuValue, { color: colors.textTertiary }]}>{item.value}</Text>
              ) : (
                <MaterialIcons name="chevron-right" size={22} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800' },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  userCard: { alignItems: 'center', paddingVertical: 28, marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: FontSize.xl, fontWeight: '800' },
  userEmail: { fontSize: FontSize.md, marginTop: 4 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  roleText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1 },
  accessCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  accessLabel: { fontSize: FontSize.sm },
  accessCode: { fontSize: FontSize.lg, fontWeight: '800', letterSpacing: 2 },
  notifCard: { marginBottom: 16 },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifText: { fontSize: FontSize.base, fontWeight: '600' },
  menuCard: { marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: Spacing.lg, borderBottomWidth: 1, gap: 14 },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: '500' },
  menuValue: { fontSize: FontSize.sm },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: BorderRadius.md, borderWidth: 1.5, marginTop: 8 },
  logoutText: { fontSize: FontSize.base, fontWeight: '700' },
});
