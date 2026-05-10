import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
