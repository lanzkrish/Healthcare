/**
 * Home Dashboard Screen
 * Main landing screen with greeting, next appointment card, quick actions, and resources
 */
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useMedicationStore } from '../store/medicationStore';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

export const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { medications, fetchMedications } = useMedicationStore();
  const [refreshing, setRefreshing] = React.useState(false);

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
    { icon: 'monitoring' as const, label: 'Symptom\nTracker', bg: colors.featureOrange, fg: colors.featureOrangeFg, nav: 'Tracker' },
    { icon: 'near-me' as const, label: 'Hospital\nNavigation', bg: colors.featurePurple, fg: colors.featurePurpleFg, nav: 'Profile', params: { screen: 'HospitalNavigation' } },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="person" size={24} color={colors.accentBlue} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>HealPath</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceSecondary }]}>
            <MaterialIcons name="search" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surfaceSecondary }]}>
            <MaterialIcons name="notifications" size={22} color={colors.textSecondary} />
            <View style={[styles.badge, { backgroundColor: colors.error }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentBlue} />}
      >
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
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800', paddingLeft: 12 },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
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
