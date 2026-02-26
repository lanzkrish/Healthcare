/**
 * Splash Screen - Animated app launch screen
 */
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const SplashScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('RoleSelection'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={require('../../assets/splash-screen.png')} style={styles.splashIcon} />
        <Text style={[styles.title, { color: colors.text }]}>HealPath</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your health companion
        </Text>
      </Animated.View>
      <Text style={[styles.footer, { color: colors.textTertiary }]}>
        Cancer Care Management
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  splashIcon: { width: 60, height: 60, resizeMode: 'contain' },
  title: { fontSize: 36, fontFamily: 'Comfortaa_700Bold', letterSpacing: -1 },
  subtitle: { fontSize: 16, marginTop: 8, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 50, fontSize: 14 },
});
