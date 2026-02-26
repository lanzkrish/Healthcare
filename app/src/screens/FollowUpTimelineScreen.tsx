/**
 * Follow-Up Timeline Screen
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { TimelineItem } from '../components/TimelineItem';
import { SectionHeader } from '../components/SectionHeader';
import { FollowUp } from '../types';
import { followUpService } from '../services/followUpService';
import { FontSize, Spacing } from '../utils/theme';
import { TouchableOpacity } from 'react-native';

export const FollowUpTimelineScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = async () => {
    try {
      const response = await followUpService.getAll();
      setFollowUps(response.data.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()));
    } catch {} finally { setLoading(false); }
  };

  const pending = followUps.filter((f) => f.status === 'pending');
  const completed = followUps.filter((f) => f.status === 'completed');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>


      <ScrollView contentContainerStyle={styles.scroll}>
        {pending.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Upcoming" />
            {pending.map((f, i) => (
              <TimelineItem key={f._id} title={f.title} date={f.scheduledDate}
                type={f.type} status={f.status} isLast={i === pending.length - 1} />
            ))}
          </View>
        )}

        {completed.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Completed" />
            {completed.map((f, i) => (
              <TimelineItem key={f._id} title={f.title} date={f.scheduledDate}
                type={f.type} status={f.status} isLast={i === completed.length - 1} />
            ))}
          </View>
        )}

        {followUps.length === 0 && !loading && (
          <View style={styles.empty}>
            <MaterialIcons name="timeline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No follow-ups scheduled</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  section: { marginBottom: Spacing.xxl },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: FontSize.base },
});
