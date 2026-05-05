import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorPalette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

interface Theme {
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

const ThemeContext = createContext<Theme>({
  colors: lightColors,
  typography,
  spacing,
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => useContext(ThemeContext);
