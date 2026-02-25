/**
 * OTP Verification Screen
 */
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { FontSize, Spacing, BorderRadius } from '../utils/theme';

export const OTPScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const phone = route.params?.phone || '+91 XXXXXXXXXX';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit code');
      return;
    }
    // Firebase OTP verification would go here
    Alert.alert('Success', 'OTP verified successfully!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="verified" size={40} color={colors.accentBlue} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Verify Your Phone</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We sent a 6-digit code to {phone}
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputs.current[i] = ref)}
              style={[styles.otpInput, {
                backgroundColor: colors.surface,
                borderColor: digit ? colors.accentBlue : colors.border,
                color: colors.text,
              }]}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && i > 0) {
                  inputs.current[i - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <PrimaryButton title="Verify" onPress={handleVerify} style={{ marginTop: 32 }} />

        <Text style={[styles.resend, { color: colors.textSecondary }]}>
          Didn't receive the code?{' '}
          <Text style={{ color: colors.accentBlue, fontWeight: '700' }}>Resend</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xxl, paddingTop: 60 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.base, marginTop: 8, textAlign: 'center' },
  otpRow: { flexDirection: 'row', gap: 10, marginTop: 40 },
  otpInput: {
    width: 48, height: 56, borderRadius: BorderRadius.sm,
    borderWidth: 1.5, fontSize: FontSize.xl, fontWeight: '700',
  },
  resend: { marginTop: 24, fontSize: FontSize.md },
});
