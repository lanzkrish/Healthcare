/**
 * Symptom Tracker Screen
 * Daily symptom logging with mood, pain level, and symptom selection
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useSymptomStore } from '../store/symptomStore';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { MoodType } from '../types';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

const MOODS: { key: MoodType; emoji: string; label: string }[] = [
  { key: 'great', emoji: '😊', label: 'Great' },
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'bad', emoji: '😔', label: 'Bad' },
  { key: 'terrible', emoji: '😢', label: 'Terrible' },
];

const SYMPTOMS = ['Fatigue', 'Nausea', 'Pain', 'Dizziness', 'Headache', 'Fever', 'Appetite Loss', 'Insomnia', 'Numbness', 'Anxiety'];

export const SymptomTrackerScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { logs, fetchLogs, createLog, isLoading } = useSymptomStore();
  const [mood, setMood] = useState<MoodType>('okay');
  const [painLevel, setPainLevel] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    try {
      await createLog({ mood, painLevel, symptoms: selectedSymptoms, notes });
      Alert.alert('Logged', 'Your symptoms have been recorded.');
      setMood('okay'); setPainLevel(3); setSelectedSymptoms([]); setNotes('');
    } catch {
      Alert.alert('Error', 'Failed to save symptom log');
    }
  };

  const moodColors: Record<MoodType, string> = {
    great: colors.moodGreat, good: colors.moodGood, okay: colors.moodOkay,
    bad: colors.moodBad, terrible: colors.moodTerrible,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Symptom Tracker</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MedicationTracker')}>
          <Text style={[styles.navLink, { color: colors.accentBlue }]}>Medications →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Mood Selection */}
        <View style={styles.section}>
          <SectionHeader title="How are you feeling?" />
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity key={m.key} style={[styles.moodBtn, {
                backgroundColor: mood === m.key ? moodColors[m.key] + '20' : colors.surface,
                borderColor: mood === m.key ? moodColors[m.key] : colors.border,
              }]} onPress={() => setMood(m.key)}>
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, { color: mood === m.key ? moodColors[m.key] : colors.textSecondary }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pain Level */}
        <View style={styles.section}>
          <SectionHeader title={`Pain Level: ${painLevel}/10`} />
          <View style={styles.painRow}>
            {Array.from({ length: 11 }, (_, i) => (
              <TouchableOpacity key={i} style={[styles.painDot, {
                backgroundColor: i <= painLevel
                  ? i <= 3 ? colors.moodGood : i <= 6 ? colors.moodOkay : colors.moodTerrible
                  : colors.surfaceSecondary,
              }]} onPress={() => setPainLevel(i)}>
                <Text style={[styles.painNum, { color: i <= painLevel ? '#FFF' : colors.textTertiary }]}>
                  {i}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <SectionHeader title="Symptoms" />
          <View style={styles.symptomGrid}>
            {SYMPTOMS.map((s) => (
              <TouchableOpacity key={s} style={[styles.symptomChip, {
                backgroundColor: selectedSymptoms.includes(s) ? colors.accentBlue + '15' : colors.surface,
                borderColor: selectedSymptoms.includes(s) ? colors.accentBlue : colors.border,
              }]} onPress={() => toggleSymptom(s)}>
                <Text style={[styles.symptomText, {
                  color: selectedSymptoms.includes(s) ? colors.accentBlue : colors.textSecondary,
                }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <SectionHeader title="Notes (Optional)" />
          <TextInput
            style={[styles.notesInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="How are you feeling today..."
            placeholderTextColor={colors.textTertiary}
            multiline numberOfLines={3}
            value={notes} onChangeText={setNotes}
          />
        </View>

        <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: 32 }}>
          <PrimaryButton title="Log Symptoms" onPress={handleSubmit} loading={isLoading} />
        </View>

        {/* Recent Logs */}
        {logs.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recent Logs" />
            {logs.slice(0, 5).map((log) => (
              <Card key={log._id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logEmoji}>{MOODS.find((m) => m.key === log.mood)?.emoji || '😐'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.logDate, { color: colors.text }]}>
                      {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={[styles.logPain, { color: colors.textSecondary }]}>Pain: {log.painLevel}/10</Text>
                  </View>
                </View>
                {log.symptoms.length > 0 && (
                  <View style={styles.logSymptoms}>
                    {log.symptoms.map((s, i) => (
                      <View key={i} style={[styles.logChip, { backgroundColor: colors.surfaceSecondary }]}>
                        <Text style={[styles.logChipText, { color: colors.textSecondary }]}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800' },
  navLink: { fontSize: FontSize.md, fontWeight: '600' },
  scroll: { paddingBottom: 40 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: BorderRadius.md, borderWidth: 1.5 },
  moodEmoji: { fontSize: 24 },
  moodLabel: { fontSize: FontSize.xs, marginTop: 4, fontWeight: '600' },
  painRow: { flexDirection: 'row', justifyContent: 'space-between' },
  painDot: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  painNum: { fontSize: FontSize.xs, fontWeight: '700' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  symptomText: { fontSize: FontSize.sm, fontWeight: '600' },
  notesInput: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.lg, fontSize: FontSize.base, minHeight: 80, textAlignVertical: 'top' },
  logCard: { marginBottom: 8 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logEmoji: { fontSize: 28 },
  logDate: { fontSize: FontSize.md, fontWeight: '700' },
  logPain: { fontSize: FontSize.sm },
  logSymptoms: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  logChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  logChipText: { fontSize: FontSize.xs, fontWeight: '600' },
});
