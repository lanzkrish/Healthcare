# HealPath - Cancer Care Management App

A full-stack mobile application for cancer patient management, built with Expo (React Native + TypeScript) and Node.js.

## 🏥 Features

- **Authentication** — JWT-based with role selection (Patient / Caregiver)
- **Appointments** — CRUD with upcoming/past tabs, booking form
- **Medication Tracker** — Schedule tracking with mark-as-taken per time slot
- **Symptom Tracker** — Daily mood, pain level, and symptom logging
- **Follow-up Timeline** — Visual timeline for scans, visits, and lab tests
- **Caregiver Linking** — Patients share access codes for caregiver read-only access
- **Hospital Navigation** — Department directory and facility guide
- **Resources** — Educational content and FAQ section
- **Push Notifications** — Expo Push Notifications for reminders
- **Offline Support** — AsyncStorage caching with background sync
- **Dark Mode** — Full dark mode support

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo SDK 52, React Native, TypeScript |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| State | Zustand |
| Forms | React Hook Form + Zod validation |
| API Client | Axios with JWT interceptors |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas-ready) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Notifications | Expo Push Notifications, expo-server-sdk |

## 📁 Project Structure

```
Healthcare/
├── app/                          # Expo React Native Frontend
│   ├── App.tsx                   # Entry point
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── hooks/                # Custom hooks (useTheme)
│       ├── navigation/           # Stack + Tab navigators
│       ├── screens/              # 15 app screens
│       ├── services/             # API service layer
│       ├── store/                # Zustand state stores
│       ├── types/                # TypeScript type definitions
│       └── utils/                # Theme and utilities
│
└── server/                       # Node.js Express Backend
    ├── index.js                  # Server entry point
    ├── controllers/              # Route handlers
    ├── middleware/                # Auth + validation
    ├── models/                   # MongoDB schemas
    └── routes/                   # API route definitions
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
# Edit .env with your MongoDB URI and JWT secrets
cp .env.example .env

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd app

# Install dependencies
npm install

# Update API base URL in src/services/api.ts
# Change 'http://localhost:5000/api' to your server's IP
# For Expo Go on physical device: use your computer's local IP

# Start Expo
npx expo start
# Scan QR code with Expo Go app
```

### 3. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP (or allow from anywhere: `0.0.0.0/0`)
4. Copy connection string to `server/.env` as `MONGODB_URI`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET/POST | `/api/appointments` | List/Create appointments |
| PUT/DELETE | `/api/appointments/:id` | Update/Delete appointment |
| GET/POST | `/api/medications` | List/Create medications |
| POST | `/api/medications/:id/taken` | Mark as taken |
| GET/POST | `/api/symptoms` | List/Create symptom logs |
| POST | `/api/symptoms/bulk` | Bulk sync offline logs |
| GET/POST | `/api/followups` | List/Create follow-ups |
| POST | `/api/caregiver/link` | Link caregiver to patient |
| GET | `/api/caregiver/access-code` | Get patient access code |

## 🎨 Design System

- **Colors**: Soft blue (#e3f2fc) + accent (#007AFF) healthcare palette
- **Font**: Inter (400–800 weights)
- **Min font size**: 16px for accessibility
- **Components**: Rounded cards, soft shadows, Material Icons
- **Dark mode**: Full system-preference-based dark mode

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens (15min expiry) + refresh tokens (7d)
- Request body validation with express-validator
- Role-based route protection
- Environment variables for all secrets
