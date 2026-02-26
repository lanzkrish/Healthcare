/**
 * Login Screen - Email/password login with form validation
 */
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { InputField } from '../components/InputField';
import { FontSize, Spacing } from '../utils/theme';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Image source={require('../../assets/splash-screen.png')} style={styles.logoImage} />
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Please enter your details to sign in
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              )}
            />
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={[styles.forgotText, { color: colors.accentBlue }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryButton title="Login" onPress={handleSubmit(onSubmit)} loading={isLoading} />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <PrimaryButton
              title="Continue with Google"
              variant="outline"
              onPress={() => Alert.alert('Google Sign-In', 'Google OAuth integration coming soon')}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
              <Text
                style={{ color: colors.accentBlue, fontWeight: '700' }}
                onPress={() => navigation.navigate('Register')}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoImage: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 24 },
  title: { fontSize: 32, fontFamily: 'Comfortaa_700Bold', letterSpacing: -1 },
  subtitle: { fontSize: FontSize.base, marginTop: 8 },
  form: { paddingVertical: 12 },
  forgotLink: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: { fontSize: FontSize.md, fontWeight: '600' },
  actions: { paddingVertical: 24, gap: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: 16, fontSize: FontSize.sm },
  footer: { marginTop: 'auto', paddingBottom: 24, alignItems: 'center' },
  footerText: { fontSize: FontSize.md },
});
