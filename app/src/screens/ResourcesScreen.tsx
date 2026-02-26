/**
 * Resources Screen - FAQs and educational content
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

const FAQS = [
  { q: 'What should I expect during chemotherapy?', a: 'Chemotherapy treatments vary by type and dosage. Common side effects include fatigue, nausea, and hair loss. Your doctor will provide a detailed treatment plan.' },
  { q: 'How can caregivers link their account?', a: 'Patients can generate an access code from their Profile. Caregivers enter this code to link their account and view patient data.' },
  { q: 'How do medication reminders work?', a: 'Add your medications with dosage and schedule times. The app will send push notifications at each scheduled time as a reminder.' },
  { q: 'How do I track my symptoms?', a: 'Go to the Tracker tab and log your daily mood, pain level, and symptoms. This data helps your healthcare team monitor your progress.' },
  { q: 'Is my data secure?', a: 'Yes. All data is encrypted in transit and at rest. We use industry-standard security practices and comply with healthcare data regulations.' },
];

const RESOURCES = [
  { title: 'Understanding Your Diagnosis', category: 'Education', icon: 'school' as const, time: '15 min' },
  { title: 'Nutrition During Treatment', category: 'Diet', icon: 'restaurant' as const, time: '10 min' },
  { title: 'Exercise & Wellness Guide', category: 'Wellness', icon: 'fitness-center' as const, time: '8 min' },
  { title: 'Managing Pain & Discomfort', category: 'Health', icon: 'healing' as const, time: '12 min' },
  { title: 'Mental Health Support', category: 'Wellbeing', icon: 'psychology' as const, time: '10 min' },
  { title: 'Post-Treatment Care Plan', category: 'Recovery', icon: 'favorite' as const, time: '14 min' },
];

export const ResourcesScreen = () => {
  const { colors } = useTheme();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>


      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Educational Resources */}
        <View style={styles.section}>
          <SectionHeader title="Educational Content" />
          <View style={styles.resourceGrid}>
            {RESOURCES.map((res, i) => (
              <TouchableOpacity key={i} style={[styles.resourceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.resIcon, { backgroundColor: colors.featureBlue }]}>
                  <MaterialIcons name={res.icon} size={24} color={colors.featureBlueFg} />
                </View>
                <Text style={[styles.resTitle, { color: colors.text }]} numberOfLines={2}>{res.title}</Text>
                <View style={styles.resMeta}>
                  <Text style={[styles.resCat, { color: colors.accentBlue }]}>{res.category}</Text>
                  <Text style={[styles.resTime, { color: colors.textTertiary }]}>{res.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <SectionHeader title="Frequently Asked Questions" />
          {FAQS.map((faq, i) => (
            <TouchableOpacity key={i} onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}>
              <Card style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQ, { color: colors.text }]}>{faq.q}</Text>
                  <MaterialIcons
                    name={expandedFaq === i ? 'expand-less' : 'expand-more'}
                    size={24} color={colors.textSecondary}
                  />
                </View>
                {expandedFaq === i && (
                  <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.a}</Text>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Card>
            <View style={styles.supportContent}>
              <MaterialIcons name="support-agent" size={36} color={colors.accentBlue} />
              <Text style={[styles.supportTitle, { color: colors.text }]}>Need Help?</Text>
              <Text style={[styles.supportDesc, { color: colors.textSecondary }]}>
                Our support team is available 24/7 for any questions.
              </Text>
              <TouchableOpacity style={[styles.supportBtn, { backgroundColor: colors.primary }]}>
                <Text style={[styles.supportBtnText, { color: colors.accentBlue }]}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800' },
  scroll: {},
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  resourceCard: { width: '47%', padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, gap: 10 },
  resIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  resTitle: { fontSize: FontSize.md, fontWeight: '700', lineHeight: 20 },
  resMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resCat: { fontSize: FontSize.xs, fontWeight: '700' },
  resTime: { fontSize: FontSize.xs },
  faqCard: { marginBottom: 8 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { flex: 1, fontSize: FontSize.md, fontWeight: '700', paddingRight: 8 },
  faqA: { fontSize: FontSize.md, lineHeight: 22, marginTop: 10 },
  supportContent: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  supportTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  supportDesc: { fontSize: FontSize.md, textAlign: 'center' },
  supportBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  supportBtnText: { fontWeight: '700', fontSize: FontSize.md },
});
