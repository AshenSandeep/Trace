import React from 'react';
import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';

function AppContent() {
  const { colors, typography } = useTheme();
  return (
    <Text style={{ color: colors.textPrimary, ...typography.h1, textAlign: 'center', marginTop: 100 }}>
      Trace
    </Text>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
