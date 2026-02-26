/**
 * Medication Tracker Screen
 * Lists active medications with mark-as-taken functionality
 */
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useMedicationStore } from '../store/medicationStore';
import { Card } from '../components/Card';
import { Medication } from '../types';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

export const MedicationScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { medications, fetchMedications, markAsTaken, isLoading } = useMedicationStore();

  useEffect(() => { fetchMedications(); }, []);

  const activeMeds = medications.filter((m) => m.active);

  const isTakenToday = (med: Medication, time: string) => {
    const today = new Date().toDateString();
    return med.takenLog.some((l) => new Date(l.date).toDateString() === today && l.time === time && l.taken);
  };

  const handleTaken = (med: Medication, time: string) => {
    if (!isTakenToday(med, time)) markAsTaken(med._id, time);
  };

  const freqLabel: Record<string, string> = {
    once_daily: 'Once Daily', twice_daily: 'Twice Daily',
    thrice_daily: 'Three Times Daily', weekly: 'Weekly', as_needed: 'As Needed',
  };

  const renderMed = ({ item }: { item: Medication }) => (
    <Card style={styles.medCard}>
      <View style={styles.medHeader}>
        <View style={[styles.medIcon, { backgroundColor: colors.featureGreen }]}>
          <MaterialIcons name="medication" size={22} color={colors.featureGreenFg} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.medName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.medDosage, { color: colors.textSecondary }]}>
            {item.dosage} • {freqLabel[item.frequency] || item.frequency}
          </Text>
        </View>
      </View>
      {item.instructions && (
        <Text style={[styles.instructions, { color: colors.textTertiary }]}>📋 {item.instructions}</Text>
      )}
      <View style={styles.timeRow}>
        {item.times.map((time) => {
          const taken = isTakenToday(item, time);
          return (
            <TouchableOpacity key={time} style={[styles.timeChip, {
              backgroundColor: taken ? colors.success + '15' : colors.surfaceSecondary,
              borderColor: taken ? colors.success : colors.border,
            }]} onPress={() => handleTaken(item, time)} disabled={taken}>
              <MaterialIcons
                name={taken ? 'check-circle' : 'radio-button-unchecked'}
                size={18} color={taken ? colors.success : colors.textTertiary}
              />
              <Text style={[styles.timeText, {
                color: taken ? colors.success : colors.text,
                textDecorationLine: taken ? 'line-through' : 'none',
              }]}>{time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <FlatList
        data={activeMeds}
        keyExtractor={(item) => item._id}
        renderItem={renderMed}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Spacing.md }}>
            <TouchableOpacity onPress={() => navigation.navigate('FollowUpTimeline')}>
              <Text style={[styles.navLink, { color: colors.accentBlue }]}>Timeline →</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchMedications}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="medication" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No active medications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  navLink: { fontSize: FontSize.md, fontWeight: '600' },
  list: { padding: Spacing.lg, paddingBottom: 40 },
  medCard: { marginBottom: 12 },
  medHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  medIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  medName: { fontSize: FontSize.base, fontWeight: '700' },
  medDosage: { fontSize: FontSize.sm, marginTop: 2 },
  instructions: { fontSize: FontSize.sm, marginBottom: 8 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  timeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  timeText: { fontSize: FontSize.sm, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: FontSize.base },
});
