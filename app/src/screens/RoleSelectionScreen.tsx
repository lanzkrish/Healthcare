/**
 * Role Selection Screen
 * User selects Patient or Caregiver role before registration
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

export const RoleSelectionScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [selectedRole, setSelectedRole] = React.useState<'patient' | 'caregiver'>('patient');

  const roles = [
    {
      key: 'patient' as const,
      icon: 'person' as const,
      title: 'I am a Patient',
      desc: 'Manage your appointments, medications, and health tracking',
      bg: colors.featureBlue,
      fg: colors.featureBlueFg,
    },
    {
      key: 'caregiver' as const,
      icon: 'medical-services' as const,
      title: 'I am a Caregiver',
      desc: 'Support and monitor a patient\'s health journey',
      bg: colors.featureGreen,
      fg: colors.featureGreenFg,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="medical-services" size={32} color={colors.accentBlue} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to HealPath</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          How would you like to use the app?
        </Text>
      </View>

      <View style={styles.roles}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.roleCard,
              {
                backgroundColor: colors.surface,
                borderColor: selectedRole === role.key ? colors.accentBlue : colors.border,
                borderWidth: selectedRole === role.key ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedRole(role.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.roleIcon, { backgroundColor: role.bg }]}>
              <MaterialIcons name={role.icon} size={28} color={role.fg} />
            </View>
            <View style={styles.roleText}>
              <Text style={[styles.roleTitle, { color: colors.text }]}>{role.title}</Text>
              <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>{role.desc}</Text>
            </View>
            <View style={[styles.radio, {
              borderColor: selectedRole === role.key ? colors.accentBlue : colors.border,
              backgroundColor: selectedRole === role.key ? colors.accentBlue : 'transparent',
            }]}>
              {selectedRole === role.key && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => navigation.navigate('Register', { role: selectedRole })}
        />
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
            <Text style={{ color: colors.accentBlue, fontWeight: '700' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 32 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.base, marginTop: 8, textAlign: 'center' },
  roles: { gap: 16 },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: BorderRadius.lg },
  roleIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  roleText: { flex: 1, marginLeft: 16 },
  roleTitle: { fontSize: FontSize.base, fontWeight: '700' },
  roleDesc: { fontSize: FontSize.sm, marginTop: 4, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' },
  footer: { marginTop: 'auto', paddingBottom: 24, paddingTop: 20 },
  loginLink: { alignItems: 'center', paddingTop: 20 },
  loginText: { fontSize: FontSize.md },
});
