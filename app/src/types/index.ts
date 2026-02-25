/**
 * Core TypeScript type definitions for the HealPath app
 */

// ── User Types ───────────────────────────────────────────────
export type UserRole = 'patient' | 'caregiver' | 'admin';

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    linkedPatientId?: string;
    accessCode?: string;
    language: string;
    avatar?: string;
    expoPushToken?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface TokenRefreshResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

// ── Appointment Types ────────────────────────────────────────
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
    _id: string;
    patientId: string;
    doctorName: string;
    department: string;
    date: string;
    location: string;
    status: AppointmentStatus;
    notes?: string;
    reminderSent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentData {
    doctorName: string;
    department: string;
    date: string;
    location: string;
    notes?: string;
}

// ── Medication Types ─────────────────────────────────────────
export type MedicationFrequency = 'once_daily' | 'twice_daily' | 'thrice_daily' | 'weekly' | 'as_needed';

export interface TakenLogEntry {
    date: string;
    time: string;
    taken: boolean;
}

export interface Medication {
    _id: string;
    patientId: string;
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    times: string[];
    active: boolean;
    startDate: string;
    endDate?: string;
    instructions?: string;
    takenLog: TakenLogEntry[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateMedicationData {
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    times: string[];
    instructions?: string;
    startDate?: string;
    endDate?: string;
}

// ── Symptom Types ────────────────────────────────────────────
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export interface SymptomLog {
    _id: string;
    patientId: string;
    date: string;
    mood: MoodType;
    painLevel: number;
    symptoms: string[];
    notes?: string;
    synced: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSymptomLogData {
    date?: string;
    mood: MoodType;
    painLevel: number;
    symptoms: string[];
    notes?: string;
}

// ── Follow-Up Types ──────────────────────────────────────────
export type FollowUpType = 'scan' | 'doctor_visit' | 'lab_test' | 'other';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';

export interface FollowUp {
    _id: string;
    patientId: string;
    title: string;
    scheduledDate: string;
    type: FollowUpType;
    status: FollowUpStatus;
    notes?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFollowUpData {
    title: string;
    scheduledDate: string;
    type: FollowUpType;
    notes?: string;
    location?: string;
}

// ── API Response Types ───────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
}

// ── Navigation Types ─────────────────────────────────────────
export type AuthStackParamList = {
    Splash: undefined;
    RoleSelection: undefined;
    Login: undefined;
    Register: { role?: UserRole };
    OTPVerification: { phone: string };
};

export type MainTabParamList = {
    Home: undefined;
    Appointments: undefined;
    Tracker: undefined;
    Resources: undefined;
    Profile: undefined;
};

export type AppointmentStackParamList = {
    AppointmentList: undefined;
    BookAppointment: undefined;
};

export type TrackerStackParamList = {
    SymptomTracker: undefined;
    MedicationTracker: undefined;
    FollowUpTimeline: undefined;
};

export type ProfileStackParamList = {
    ProfileSettings: undefined;
    CaregiverLink: undefined;
    HospitalNavigation: undefined;
};
