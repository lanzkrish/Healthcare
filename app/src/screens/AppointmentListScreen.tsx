/**
 * Appointment List Screen
 * Shows upcoming and past appointments with tabs
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../store/appointmentStore';
import { Card } from '../components/Card';
import { Appointment } from '../types';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

export const AppointmentListScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { appointments, fetchAppointments, deleteAppointment, updateAppointment, isLoading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = appointments.filter((a) =>
    activeTab === 'upcoming'
      ? a.status === 'upcoming'
      : a.status === 'completed' || a.status === 'cancelled'
  );

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No' },
      { text: 'Yes', style: 'destructive', onPress: () => updateAppointment(id, { status: 'cancelled' }) },
    ]);
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <Card noPadding style={{ marginBottom: 12 }}>
      <View style={styles.cardRow}>
        <View style={[styles.docImage, { backgroundColor: colors.surfaceSecondary }]}>
          <MaterialIcons name="person" size={28} color={colors.textTertiary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.docName, { color: colors.text }]}>{item.doctorName}</Text>
          <Text style={[styles.dept, { color: colors.accentBlue }]}>{item.department}</Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={14} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' • '}{new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={14} color={colors.textTertiary} />
            <Text style={[styles.detailText, { color: colors.textTertiary }]} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </View>
      {activeTab === 'upcoming' && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]}
            onPress={() => handleCancel(item._id)}>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>


      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(['upcoming', 'past'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, {
            borderBottomColor: activeTab === tab ? colors.accentBlue : 'transparent',
          }]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, {
              color: activeTab === tab ? colors.text : colors.textTertiary,
              fontWeight: activeTab === tab ? '700' : '500',
            }]}>{tab === 'upcoming' ? 'Upcoming' : 'Past'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="event-available" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No {activeTab} appointments</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchAppointments}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.text }]}
        onPress={() => navigation.navigate('BookAppointment')}
      >
        <MaterialIcons name="add" size={28} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2 },
  tabText: { fontSize: FontSize.md },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  cardRow: { flexDirection: 'row', padding: Spacing.lg, gap: 12 },
  docImage: { width: 64, height: 64, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  docName: { fontSize: FontSize.base, fontWeight: '700' },
  dept: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  detailText: { fontSize: FontSize.sm },
  cardActions: { flexDirection: 'row', gap: 12, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  actionBtn: { flex: 1, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: FontSize.md, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: FontSize.base },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6 },
});
