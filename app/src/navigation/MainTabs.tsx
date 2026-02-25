/**
 * Main Tab Navigator with nested stacks
 * Using native-stack for Expo Go compatibility
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

// Screen imports
import { HomeScreen } from '../screens/HomeScreen';
import { AppointmentListScreen } from '../screens/AppointmentListScreen';
import { BookAppointmentScreen } from '../screens/BookAppointmentScreen';
import { SymptomTrackerScreen } from '../screens/SymptomTrackerScreen';
import { MedicationScreen } from '../screens/MedicationScreen';
import { FollowUpTimelineScreen } from '../screens/FollowUpTimelineScreen';
import { ResourcesScreen } from '../screens/ResourcesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CaregiverLinkScreen } from '../screens/CaregiverLinkScreen';
import { HospitalNavigationScreen } from '../screens/HospitalNavigationScreen';

// ── Appointment Stack ─────────────────────────────────
const AppStack = createNativeStackNavigator();
const AppointmentStack = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="AppointmentList" component={AppointmentListScreen} />
    <AppStack.Screen name="BookAppointment" component={BookAppointmentScreen} />
  </AppStack.Navigator>
);

// ── Tracker Stack ─────────────────────────────────────
const TrkStack = createNativeStackNavigator();
const TrackerStack = () => (
  <TrkStack.Navigator screenOptions={{ headerShown: false }}>
    <TrkStack.Screen name="SymptomTracker" component={SymptomTrackerScreen} />
    <TrkStack.Screen name="MedicationTracker" component={MedicationScreen} />
    <TrkStack.Screen name="FollowUpTimeline" component={FollowUpTimelineScreen} />
  </TrkStack.Navigator>
);

// ── Profile Stack ──────────────────────────────────────
const ProfStack = createNativeStackNavigator();
const ProfileStack = () => (
  <ProfStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfStack.Screen name="ProfileSettings" component={ProfileScreen} />
    <ProfStack.Screen name="CaregiverLink" component={CaregiverLinkScreen} />
    <ProfStack.Screen name="HospitalNavigation" component={HospitalNavigationScreen} />
  </ProfStack.Navigator>
);

// ── Bottom Tab Navigator ────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Home: 'home',
  Appointments: 'calendar-month',
  Tracker: 'query-stats',
  Resources: 'auto-stories',
  Profile: 'person',
};

export const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialIcons name={tabIcons[route.name]} size={24} color={color} />
        ),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600' as const,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentStack} />
      <Tab.Screen name="Tracker" component={TrackerStack} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};
