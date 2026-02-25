/**
 * TimelineItem - Used in follow-up timeline display
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';
import { FollowUpType } from '../types';

interface Props {
  title: string;
  date: string;
  type: FollowUpType;
  status: string;
  isLast?: boolean;
}

const typeConfig: Record<FollowUpType, { icon: keyof typeof MaterialIcons.glyphMap; label: string }> = {
  scan: { icon: 'photo-camera', label: 'Scan' },
  doctor_visit: { icon: 'medical-services', label: 'Doctor Visit' },
  lab_test: { icon: 'science', label: 'Lab Test' },
  other: { icon: 'event', label: 'Other' },
};

export const TimelineItem: React.FC<Props> = ({ title, date, type, status, isLast }) => {
  const { colors } = useTheme();
  const config = typeConfig[type];
  const isPending = status === 'pending';

  return (
    <View style={styles.container}>
      {/* Timeline line */}
      <View style={styles.timeline}>
        <View style={[styles.dot, {
          backgroundColor: isPending ? colors.accentBlue : colors.success,
          borderColor: isPending ? colors.primary : colors.success,
        }]} />
        {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>
      {/* Content */}
      <View style={[styles.content, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <MaterialIcons name={config.icon} size={18} color={colors.accentBlue} />
          <Text style={[styles.typeLabel, { color: colors.accentBlue }]}>{config.label}</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginBottom: Spacing.lg },
  timeline: { width: 32, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, zIndex: 1 },
  line: { width: 2, flex: 1, marginTop: -2 },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  typeLabel: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', marginLeft: Spacing.xs, letterSpacing: 1 },
  title: { fontSize: FontSize.base, fontWeight: '700', marginBottom: Spacing.xs },
  date: { fontSize: FontSize.sm },
});
