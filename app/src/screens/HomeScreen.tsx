/**
 * Home Dashboard Screen
 * Main landing screen with greeting, next appointment card, quick actions, and resources
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useMedicationStore } from '../store/medicationStore';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';
import api from '../services/api';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { medications, fetchMedications } = useMedicationStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Register for push notifications (works in production builds, fails gracefully in Expo Go)
  useEffect(() => {
    registerForPushNotifications();

    // Listen for incoming notifications while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📩 Notification received:', notification.request.content);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response.notification.request.content);
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'HealPath',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#007AFF',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'f49c4135-9e97-4a24-90ea-275c901c356c',
      })).data;
      setPushToken(token);
      console.log('🔔 Push Token:', token);

      // Save token to server so it can send notifications to this device
      try {
        await api.put('/auth/push-token', { expoPushToken: token });
        console.log('✅ Push token saved to server');
      } catch (apiError) {
        console.log('⚠️ Could not save push token to server (will retry next launch):', apiError);
      }
    } catch (error) {
      // Fails silently in Expo Go (SDK 53+), works in production builds
      console.log('Push notification setup skipped:', error);
    }
  };

  const handleBellPress = () => {
    if (pushToken) {
      Alert.alert(
        '🔔 Push Token',
        `${pushToken}\n\nTest at: expo.dev/notifications\nPaste this token and send a test notification.`,
        [
          {
            text: 'Copy Token',
            onPress: async () => {
              await Clipboard.setStringAsync(pushToken);
              Alert.alert('✅ Copied!', 'Push token copied to clipboard.');
            },
          },
          { text: 'OK' },
        ]
      );
    } else {
      Alert.alert(
        'Notifications',
        'Push token not available.\n\n• In Expo Go: not supported (SDK 53+)\n• In APK/IPA build: should work automatically',
      );
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Get next upcoming appointment
  const nextAppointment = appointments
    .filter((a) => a.status === 'upcoming' && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const activeMeds = medications.filter((m) => m.active);

  useEffect(() => {
    fetchAppointments('upcoming');
    fetchMedications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAppointments('upcoming'), fetchMedications()]);
    setRefreshing(false);
  };

  const quickActions = [
    { icon: 'calendar-month' as const, label: 'Book\nAppointment', bg: colors.featureBlue, fg: colors.featureBlueFg, nav: 'Appointments' },
    { icon: 'medication' as const, label: 'Medication\nReminder', bg: colors.featureGreen, fg: colors.featureGreenFg, nav: 'Tracker', params: { screen: 'MedicationTracker' } },
    { icon: 'show-chart' as const, label: 'Symptom\nTracker', bg: colors.featureOrange, fg: colors.featureOrangeFg, nav: 'Tracker' },
    { icon: 'near-me' as const, label: 'Hospital\nNavigation', bg: colors.featurePurple, fg: colors.featurePurpleFg, nav: 'Profile', params: { screen: 'HospitalNavigation' } },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentBlue} />}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm }}>
          <TouchableOpacity onPress={handleBellPress} style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceSecondary }}>
            <MaterialIcons name="notifications" size={22} color={colors.textSecondary} />
            <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error }} />
          </TouchableOpacity>
        </View>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.text }]}>
            {greeting}, {firstName} 👋
          </Text>
          <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>
            We hope you're feeling well today.
          </Text>
        </View>

        {/* Next Appointment Card */}
        {nextAppointment ? (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <Card noPadding>
              <View style={[styles.apptBanner, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="event" size={32} color={colors.accentBlue} />
              </View>
              <View style={styles.apptContent}>
                <View style={styles.apptHeader}>
                  <View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.featureBlue }]}>
                      <Text style={[styles.statusText, { color: colors.featureBlueFg }]}>UPCOMING</Text>
                    </View>
                    <Text style={[styles.apptTitle, { color: colors.text }]}>Next Appointment</Text>
                  </View>
                  <MaterialIcons name="event" size={22} color={colors.accentBlue} />
                </View>
                <View style={styles.apptDetail}>
                  <MaterialIcons name="medical-services" size={16} color={colors.textSecondary} />
                  <Text style={[styles.apptDetailText, { color: colors.textSecondary }]}>
                    {nextAppointment.doctorName} • {nextAppointment.department}
                  </Text>
                </View>
                <View style={styles.apptDetail}>
                  <MaterialIcons name="schedule" size={16} color={colors.textTertiary} />
                  <Text style={[styles.apptDetailText, { color: colors.textTertiary }]}>
                    {new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' • '}{nextAppointment.location}
                  </Text>
                </View>
                <View style={styles.apptActions}>
                  <TouchableOpacity
                    style={[styles.apptBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('Appointments')}
                  >
                    <Text style={[styles.apptBtnText, { color: colors.text }]}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <Card>
              <Text style={[styles.noAppt, { color: colors.textSecondary }]}>No upcoming appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Appointments', { screen: 'BookAppointment' })}>
                <Text style={[styles.bookLink, { color: colors.accentBlue }]}>Book one now →</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate(action.nav, action.params)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <MaterialIcons name={action.icon} size={24} color={action.fg} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Medications Summary */}
        {activeMeds.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Today's Medications" actionText="See All"
              onAction={() => navigation.navigate('Tracker', { screen: 'MedicationTracker' })} />
            {activeMeds.slice(0, 3).map((med) => (
              <Card key={med._id} style={styles.medCard}>
                <View style={styles.medRow}>
                  <View style={[styles.medIcon, { backgroundColor: colors.featureGreen }]}>
                    <MaterialIcons name="medication" size={20} color={colors.featureGreenFg} />
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={[styles.medName, { color: colors.text }]}>{med.name}</Text>
                    <Text style={[styles.medDosage, { color: colors.textSecondary }]}>
                      {med.dosage} • {med.times.join(', ')}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Resources */}
        <View style={[styles.section, { paddingBottom: 32 }]}>
          <SectionHeader title="Recommended Resources" actionText="See All"
            onAction={() => navigation.navigate('Resources')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { title: 'Holistic Wellness Exercises', sub: '8 min read • Wellness' },
              { title: 'Balanced Nutrition for Recovery', sub: '12 min read • Diet' },
              { title: 'Managing Treatment Side Effects', sub: '10 min read • Health' },
            ].map((res, i) => (
              <TouchableOpacity key={i} style={[styles.resourceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.resourceImage, { backgroundColor: colors.surfaceSecondary }]}>
                  <MaterialIcons name="auto-stories" size={32} color={colors.textTertiary} />
                </View>
                <Text style={[styles.resourceTitle, { color: colors.text }]} numberOfLines={1}>{res.title}</Text>
                <Text style={[styles.resourceSub, { color: colors.textTertiary }]}>{res.sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollView: { flex: 1 },
  greeting: { padding: Spacing.lg, paddingTop: Spacing.xxl },
  greetingText: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -0.5 },
  greetingSub: { fontSize: FontSize.md, marginTop: 4 },
  apptBanner: { height: 80, justifyContent: 'center', alignItems: 'center' },
  apptContent: { padding: Spacing.lg, gap: 8 },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  apptTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  apptDetail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  apptDetailText: { fontSize: FontSize.md },
  apptActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  apptBtn: { flex: 1, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  apptBtnText: { fontSize: FontSize.md, fontWeight: '700' },
  noAppt: { fontSize: FontSize.base, textAlign: 'center' },
  bookLink: { fontSize: FontSize.md, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%', padding: Spacing.lg, borderRadius: BorderRadius.md,
    borderWidth: 1, gap: 12,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: FontSize.sm, fontWeight: '700', lineHeight: 18 },
  medCard: { marginBottom: 8 },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  medIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  medInfo: { flex: 1 },
  medName: { fontSize: FontSize.base, fontWeight: '700' },
  medDosage: { fontSize: FontSize.sm, marginTop: 2 },
  resourceCard: { width: 200, marginRight: 12, borderRadius: BorderRadius.md, borderWidth: 1, overflow: 'hidden' },
  resourceImage: { height: 120, justifyContent: 'center', alignItems: 'center' },
  resourceTitle: { fontSize: FontSize.md, fontWeight: '700', paddingHorizontal: 12, paddingTop: 10 },
  resourceSub: { fontSize: FontSize.xs, paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4 },
});
