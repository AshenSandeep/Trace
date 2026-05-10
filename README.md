# Trace Mobile Issue Tracker

Track issues, ship fixes. Keep momentum.

A fully offline-capable issue tracker built with React Native CLI and TypeScript.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| JDK | 17 |
| React Native CLI | latest |
| Android Studio + Android SDK | latest |
| Xcode (iOS / macOS only) | 14+ |

## Install

```bash
git clone https://github.com/AshenSandeep/Trace.git
cd Trace
npm install
```

**iOS only:**
```bash
cd ios && pod install && cd ..
```

## Run

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## Test

```bash
npm test
```

---

## Architecture

```
src/
├── api/          Axios client + mock API functions (800 ms simulated delay)
├── components/   Reusable UI — common/, dashboard/, issues/
├── navigation/   RootNavigator (auth/main switch) + MainNavigator (bottom tabs)
├── screens/      auth/, dashboard/, issues/, profile/
├── store/        Zustand stores — authStore, issueStore
├── theme/        Light/dark palette, typography, spacing, useTheme() hook
├── types/        Shared TypeScript interfaces
└── utils/        Date formatting, ID generation, JSON/CSV export
```

**State management:** Zustand with AsyncStorage persistence. Two stores:
- `authStore` — session, login, logout, session restore on launch
- `issueStore` — issues CRUD, filter state, sync queue, online/offline flag

**Navigation:** React Navigation v7 — typed auth stack → bottom tab navigator → issues native stack (list → detail → form modal).

**Theme:** `ThemeContext` wraps the app and supplies `colors`, `typography`, and `spacing`. Auto-switches on system colour scheme; manual override (Light / Dark / System) saved to AsyncStorage.

**Offline-first:** `NetInfo` detects connectivity. Mutations while offline are pushed to an in-memory + persisted `syncQueue`. When the device comes back online, `processSyncQueue` drains the queue automatically.

---

## Assumptions

- Authentication is mocked. Any email containing `@` and a password of 6+ characters will succeed. The logged-in user is always "Alex" (`MOCK_USERS[3]`).
- The Axios base URL (`https://api.trace.mock`) is intentionally non-functional. All network calls are intercepted by mock functions that return hardcoded data after a simulated delay.
- Issue IDs (`ISS-200` – `ISS-214`) are generated locally and are not coordinated with any backend.
- Attachment upload is not implemented. The UI entry point is present in the issue form and shows a "Coming soon" alert.

---

## Screens

| Screen | Route |
|--------|-------|
| Sign In | `AuthStack > SignIn` |
| Dashboard | `MainTabs > DashboardTab` |
| Issue List | `MainTabs > IssuesTab > IssueList` |
| Issue Detail | `MainTabs > IssuesTab > IssueDetail` |
| Create / Edit Issue | `MainTabs > IssuesTab > IssueForm` (modal) |
| Profile | `MainTabs > ProfileTab` |
