/**
 * Book Appointment Screen
 */
import React from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../store/appointmentStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { InputField } from '../components/InputField';
import { FontSize, Spacing } from '../utils/theme';
import { TouchableOpacity } from 'react-native';

const schema = z.object({
  doctorName: z.string().min(2, 'Doctor name required'),
  department: z.string().min(2, 'Department required'),
  date: z.string().min(1, 'Date required'),
  location: z.string().min(2, 'Location required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const BookAppointmentScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { createAppointment, isLoading } = useAppointmentStore();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { doctorName: '', department: '', date: '', location: '', notes: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createAppointment({ ...data, date: new Date(data.date).toISOString() });
      Alert.alert('Success', 'Appointment booked!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Book Appointment</Text>
        <View style={{ width: 24 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Controller control={control} name="doctorName" render={({ field: { onChange, value } }) => (
            <InputField label="Doctor Name" placeholder="Dr. Smith" icon="person" onChangeText={onChange} value={value} error={errors.doctorName?.message} />
          )} />
          <Controller control={control} name="department" render={({ field: { onChange, value } }) => (
            <InputField label="Department" placeholder="Oncology" icon="medical-services" onChangeText={onChange} value={value} error={errors.department?.message} />
          )} />
          <Controller control={control} name="date" render={({ field: { onChange, value } }) => (
            <InputField label="Date & Time" placeholder="2026-03-01T10:00" icon="event" onChangeText={onChange} value={value} error={errors.date?.message} />
          )} />
          <Controller control={control} name="location" render={({ field: { onChange, value } }) => (
            <InputField label="Location" placeholder="City Hospital, Wing B" icon="location-on" onChangeText={onChange} value={value} error={errors.location?.message} />
          )} />
          <Controller control={control} name="notes" render={({ field: { onChange, value } }) => (
            <InputField label="Notes (Optional)" placeholder="Any special instructions..." icon="notes" onChangeText={onChange} value={value} multiline />
          )} />
          <PrimaryButton title="Book Appointment" onPress={handleSubmit(onSubmit)} loading={isLoading} style={{ marginTop: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  form: { padding: Spacing.xxl, paddingBottom: 40 },
});
