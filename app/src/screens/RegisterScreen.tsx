/**
 * Register Screen - New user registration with role selection
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { InputField } from '../components/InputField';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';
import { UserRole } from '../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const { register: registerUser, isLoading } = useAuthStore();
  const [role, setRole] = useState<UserRole>(route.params?.role || 'patient');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreed) {
      Alert.alert('Terms Required', 'Please agree to the Terms of Service');
      return;
    }
    try {
      await registerUser({ ...data, role });
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.topTitle, { color: colors.text }]}>Create Account</Text>
            <View style={{ width: 48 }} />
          </View>

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>Join HealPath</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Start your journey to better health management.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller control={control} name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField label="Full Name" placeholder="Enter your full name"
                  onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
              )} />
            <Controller control={control} name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField label="Email" placeholder="example@email.com" keyboardType="email-address"
                  autoCapitalize="none" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.email?.message} />
              )} />
            <Controller control={control} name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField label="Phone (Optional)" placeholder="+91 9876543210" keyboardType="phone-pad"
                  onChangeText={onChange} onBlur={onBlur} value={value} />
              )} />

            {/* Role Picker */}
            <Text style={[styles.label, { color: colors.text }]}>Role</Text>
            <View style={styles.roleRow}>
              {(['patient', 'caregiver'] as const).map((r) => (
                <TouchableOpacity key={r} style={[styles.roleBtn, {
                  borderColor: role === r ? colors.accentBlue : colors.border,
                  backgroundColor: role === r ? colors.primary : colors.surface,
                  borderWidth: role === r ? 2 : 1,
                }]} onPress={() => setRole(r)}>
                  <MaterialIcons
                    name={r === 'patient' ? 'person' : 'medical-services'}
                    size={22} color={role === r ? colors.accentBlue : colors.textTertiary}
                  />
                  <Text style={[styles.roleBtnText, { color: colors.text }]}>
                    {r === 'patient' ? 'Patient' : 'Caregiver'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Controller control={control} name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField label="Password" placeholder="Min. 8 characters"
                  secureTextEntry={!showPassword} onChangeText={onChange} onBlur={onBlur} value={value}
                  error={errors.password?.message}
                  rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowPassword(!showPassword)} />
              )} />

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
              <MaterialIcons
                name={agreed ? 'check-box' : 'check-box-outline-blank'}
                size={22} color={agreed ? colors.accentBlue : colors.textTertiary}
              />
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                By creating an account, I agree to the{' '}
                <Text style={{ color: colors.accentBlue }}>Terms of Service</Text> and{' '}
                <Text style={{ color: colors.accentBlue }}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <PrimaryButton title="Register" onPress={handleSubmit(onSubmit)} loading={isLoading} disabled={!agreed} />
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Already have an account? <Text style={{ color: colors.accentBlue, fontWeight: '700' }}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  backBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  headerContent: { paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: 32, fontFamily: 'Comfortaa_700Bold', letterSpacing: -1 },
  subtitle: { fontSize: FontSize.base, marginTop: 8 },
  form: { gap: 4 },
  label: { fontSize: FontSize.md, fontWeight: '600', marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: BorderRadius.sm,
  },
  roleBtnText: { fontSize: FontSize.md, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  termsText: { flex: 1, fontSize: FontSize.sm, lineHeight: 18 },
  actions: { paddingTop: 16, paddingBottom: 32 },
  loginLink: { alignItems: 'center', paddingTop: 20 },
  linkText: { fontSize: FontSize.md },
});
