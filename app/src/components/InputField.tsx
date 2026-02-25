/**
 * InputField - Form input with label, error state, and icon support
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { BorderRadius, FontSize, Spacing } from '../utils/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
}

export const InputField = React.forwardRef<TextInput, Props>(
  ({ label, error, icon, rightIcon, onRightIconPress, style, ...props }, ref) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}
        <View style={[
          styles.inputWrapper,
          { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border },
        ]}>
          {icon && (
            <MaterialIcons name={icon} size={20} color={colors.textTertiary} style={styles.icon} />
          )}
          <TextInput
            ref={ref}
            style={[styles.input, { color: colors.text }, style]}
            placeholderTextColor={colors.textTertiary}
            {...props}
          />
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
              <MaterialIcons name={rightIcon} size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: { fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.sm },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 56,
    paddingHorizontal: Spacing.lg,
  },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.base, height: '100%' },
  rightIcon: { padding: Spacing.xs },
  error: { fontSize: FontSize.sm, marginTop: Spacing.xs },
});
