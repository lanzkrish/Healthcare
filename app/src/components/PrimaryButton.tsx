/**
 * PrimaryButton - Reusable button with loading state
 */
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<Props> = ({
  title, onPress, loading, disabled, variant = 'primary', style,
}) => {
  const { colors } = useTheme();

  const bgColor = variant === 'primary' ? colors.accentBlue
    : variant === 'secondary' ? colors.surfaceSecondary : 'transparent';
  const textColor = variant === 'primary' ? '#FFF'
    : variant === 'outline' ? colors.accentBlue : colors.text;
  const borderColor = variant === 'outline' ? colors.border : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor, borderColor, opacity: disabled ? 0.5 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
  },
  text: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
