/**
 * Caregiver Link Screen
 * Patients see their access code; Caregivers enter a code to link
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { caregiverService } from '../services/followUpService';
import { Card } from '../components/Card';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { FontSize, Spacing, BorderRadius } from '../utils/theme';

export const CaregiverLinkScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [accessCode, setAccessCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkedPatient, setLinkedPatient] = useState<string | null>(null);

  const isPatient = user?.role === 'patient';

  useEffect(() => {
    if (isPatient) {
      caregiverService.getAccessCode().then((res) => setMyCode(res.data.accessCode)).catch(() => {});
    } else {
      caregiverService.getLinkedPatient()
        .then((res) => setLinkedPatient(res.data.name))
        .catch(() => {});
    }
  }, []);

  const handleLink = async () => {
    if (!accessCode.trim()) {
      Alert.alert('Error', 'Please enter an access code');
      return;
    }
    setLoading(true);
    try {
      const res = await caregiverService.link(accessCode.trim());
      Alert.alert('Success', res.message || `Linked to ${res.data.patientName}`);
      setLinkedPatient(res.data.patientName);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Caregiver Link</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {isPatient ? (
          /* Patient view: show access code */
          <Card style={styles.codeCard}>
            <View style={[styles.iconCircle, { backgroundColor: colors.featureBlue }]}>
              <MaterialIcons name="vpn-key" size={32} color={colors.featureBlueFg} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Your Access Code</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Share this code with your caregiver so they can link to your account
            </Text>
            <View style={[styles.codeBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.codeText, { color: colors.accentBlue }]}>{myCode || '------'}</Text>
            </View>
            <Text style={[styles.note, { color: colors.textTertiary }]}>
              Code is unique to your account. Caregiver will have read-only access.
            </Text>
          </Card>
        ) : (
          /* Caregiver view: enter code */
          <View>
            <Card style={styles.codeCard}>
              <View style={[styles.iconCircle, { backgroundColor: colors.featureGreen }]}>
                <MaterialIcons name="link" size={32} color={colors.featureGreenFg} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Link to a Patient</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]}>
                Enter the access code provided by the patient
              </Text>
            </Card>

            {linkedPatient ? (
              <Card style={{ marginTop: 16 }}>
                <View style={styles.linkedRow}>
                  <MaterialIcons name="check-circle" size={24} color={colors.success} />
                  <Text style={[styles.linkedText, { color: colors.text }]}>
                    Linked to: <Text style={{ fontWeight: '800' }}>{linkedPatient}</Text>
                  </Text>
                </View>
              </Card>
            ) : (
              <View style={styles.linkForm}>
                <InputField
                  label="Access Code"
                  placeholder="Enter 6-character code"
                  value={accessCode}
                  onChangeText={setAccessCode}
                  autoCapitalize="characters"
                  maxLength={6}
                />
                <PrimaryButton title="Link Account" onPress={handleLink} loading={loading} />
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  content: { padding: Spacing.lg },
  codeCard: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  desc: { fontSize: FontSize.md, textAlign: 'center', paddingHorizontal: 16 },
  codeBadge: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: BorderRadius.md, marginTop: 8 },
  codeText: { fontSize: 32, fontWeight: '800', letterSpacing: 6 },
  note: { fontSize: FontSize.sm, textAlign: 'center', paddingHorizontal: 20 },
  linkForm: { marginTop: 20, gap: 8 },
  linkedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkedText: { fontSize: FontSize.base },
});
