/**
 * Hospital Navigation Screen
 * Maps and department directory for hospital wayfinding
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

const DEPARTMENTS = [
  { name: 'Oncology', floor: '3rd Floor', wing: 'Wing A', icon: 'medical-services' as const, color: '#EF4444' },
  { name: 'Radiology', floor: '2nd Floor', wing: 'Wing B', icon: 'photo-camera' as const, color: '#8B5CF6' },
  { name: 'Laboratory', floor: '1st Floor', wing: 'Wing C', icon: 'science' as const, color: '#F59E0B' },
  { name: 'Pharmacy', floor: 'Ground Floor', wing: 'Main Lobby', icon: 'local-pharmacy' as const, color: '#22C55E' },
  { name: 'Emergency', floor: 'Ground Floor', wing: 'West Exit', icon: 'emergency' as const, color: '#EF4444' },
  { name: 'Billing', floor: 'Ground Floor', wing: 'East Wing', icon: 'receipt' as const, color: '#0EA5E9' },
];

const FACILITIES = [
  { name: 'Cafeteria', location: 'Ground Floor, East', icon: 'restaurant' as const },
  { name: 'Chapel / Meditation', location: '1st Floor, Wing D', icon: 'self-improvement' as const },
  { name: 'Parking', location: 'Basement Level', icon: 'local-parking' as const },
  { name: 'Waiting Lounge', location: 'Each Floor', icon: 'weekend' as const },
];

export const HospitalNavigationScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hospital Navigation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Map placeholder */}
        <Card noPadding style={styles.mapCard}>
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
            <MaterialIcons name="map" size={48} color={colors.textTertiary} />
            <Text style={[styles.mapText, { color: colors.textSecondary }]}>Interactive Map</Text>
            <Text style={[styles.mapSub, { color: colors.textTertiary }]}>Coming Soon</Text>
          </View>
        </Card>

        {/* Departments */}
        <View style={styles.section}>
          <SectionHeader title="Departments" />
          {DEPARTMENTS.map((dept, i) => (
            <TouchableOpacity key={i}>
              <Card style={styles.deptCard}>
                <View style={styles.deptRow}>
                  <View style={[styles.deptIcon, { backgroundColor: dept.color + '15' }]}>
                    <MaterialIcons name={dept.icon} size={22} color={dept.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.deptName, { color: colors.text }]}>{dept.name}</Text>
                    <Text style={[styles.deptInfo, { color: colors.textSecondary }]}>
                      {dept.floor} • {dept.wing}
                    </Text>
                  </View>
                  <MaterialIcons name="directions" size={22} color={colors.accentBlue} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Facilities */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <SectionHeader title="Facilities" />
          <View style={styles.facilityGrid}>
            {FACILITIES.map((f, i) => (
              <View key={i} style={[styles.facilityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <MaterialIcons name={f.icon} size={28} color={colors.accentBlue} />
                <Text style={[styles.facilityName, { color: colors.text }]}>{f.name}</Text>
                <Text style={[styles.facilityLoc, { color: colors.textTertiary }]}>{f.location}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  scroll: { padding: Spacing.lg },
  mapCard: { marginBottom: 16 },
  mapPlaceholder: { height: 180, justifyContent: 'center', alignItems: 'center', borderRadius: BorderRadius.md, gap: 8 },
  mapText: { fontSize: FontSize.lg, fontWeight: '700' },
  mapSub: { fontSize: FontSize.sm },
  section: { paddingTop: Spacing.lg },
  deptCard: { marginBottom: 8 },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  deptIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  deptName: { fontSize: FontSize.base, fontWeight: '700' },
  deptInfo: { fontSize: FontSize.sm, marginTop: 2 },
  facilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  facilityCard: { width: '47%', padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, gap: 8 },
  facilityName: { fontSize: FontSize.md, fontWeight: '700' },
  facilityLoc: { fontSize: FontSize.xs },
});
