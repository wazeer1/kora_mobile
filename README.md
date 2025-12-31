# Kora Mobile App

Kora is a modern mobile application built with React Native and Expo, designed to facilitate vibrant community interactions and debates. It features real-time capabilities, a comprehensive theming system, and a robust architecture.

## Overview

The application is structured around five main pillars accessible via the bottom navigation:
- **Arena (Home)**: The central dashboard for trending content and live debates.
- **Explore**: A powerful search and discovery interface.
- **Speak**: Tools for creating content and initiating discussions.
- **Activity**: Real-time alerts and notifications.
- **Profile**: User personalization and settings.

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app on your iOS/Android device or an Emulator/Simulator.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Kora
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npx expo start
```

This will launch the Expo development server. You can then:
- Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).
- Press `a` to open in an **Android Emulator**.
- Press `i` to open in an **iOS Simulator**.
- Press `w` to open in the **Web Browser**.

## Project Structure

The project follows a modular architecture using **Expo Router**:

- **`app/`**: Contains the file-based routing logic.
    - `(tabs)/`: Main tab-based navigation layout.
    - `(auth)/`: Authentication screens.
    - `_layout.tsx`: Root layout configuration.
- **`src/`**: Core application logic.
    - `components/`: Reusable UI components.
    - `hooks/`: Custom React hooks (e.g., `useTheme`).
    - `store/`: Redux Toolkit state management slices and store configuration.
    - `theme/`: Design tokens and theme context.
    - `context/`: React Context Providers (e.g., `SocketContext`).

## Themes & UI

Kora supports both **Light** and **Dark** modes, adapting to the user's system preference or manual override.

### Theme Usage

We use a custom `ThemeProvider` combined with `styled-components`.

```typescript
import { useTheme } from '@/src/hooks';

const MyComponent = () => {
    const theme = useTheme();
    return <Text style={{ color: theme.colors.primary }}>Hello Kora</Text>;
}
```

### Color Palette

The application uses a teal-based primary color scheme:

| Color | Light Mode | Dark Mode |
|-------|------------|-----------|
| **Primary** | `#208D9E` | `#32B8C6` |
| **Background** | `#F8F8F6` | `#1F2121` |
| **Surface** | `#FFFFFF` | `#2A2A2A` |
| **Text** | `#1A1A1A` | `#F5F5F5` |

## Key Packages

This project relies on several key libraries:

- **Core**: `react-native`, `expo`
- **Navigation**: `expo-router`, `@react-navigation/native`
- **State Management**: `@reduxjs/toolkit`, `react-redux`
- **Styling**: `styled-components`, `lucide-react-native` (Icons)
- **Networking**: `axios`, `socket.io-client`
- **Native Features**:
    - `expo-haptics`
    - `expo-image-picker`
    - `expo-secure-store`
    - `react-native-reanimated`
    - `react-native-gesture-handler`

## Scripts

- `npm run start`: Start the Expo dev server.
- `npm run android`: Run on Android emulator/device.
- `npm run ios`: Run on iOS simulator/device.
- `npm run lint`: Lint the codebase.

---

Built with ❤️ using Expo.
