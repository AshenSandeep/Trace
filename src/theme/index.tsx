import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorPalette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const THEME_KEY = '@trace/theme';
export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<Theme>({
  colors: lightColors,
  typography,
  spacing,
  isDark: false,
  themeMode: 'system',
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(raw => {
      if (raw === 'light' || raw === 'dark' || raw === 'system') {
        setThemeModeState(raw);
      }
    });
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const isDark =
    themeMode === 'dark' ? true :
    themeMode === 'light' ? false :
    colorScheme === 'dark';

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => useContext(ThemeContext);
