/**
 * SectionHeader - Section title with optional "See All" action
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FontSize, Spacing } from '../utils/theme';

interface Props {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<Props> = ({ title, actionText, onAction }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.action, { color: colors.accentBlue }]}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  action: { fontSize: FontSize.md, fontWeight: '600' },
});
