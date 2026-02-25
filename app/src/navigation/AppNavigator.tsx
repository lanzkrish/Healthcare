/**
 * Root App Navigator
 * Switches between Auth and Main stacks based on authentication state
 */
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    loadUser();
  }, []);

  // Custom navigation theme matching our design system
  const navTheme = isDark ? {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface },
  } : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface },
  };

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accentBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
