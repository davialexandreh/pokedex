import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { palettes } from './colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState(null);

  const isDark = (override ?? systemScheme) === 'dark';

  const toggleTheme = useCallback(() => {
    setOverride((curr) => {
      const current = curr ?? systemScheme;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? palettes.dark : palettes.light,
      toggleTheme,
    }),
    [isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;
  // Fallback to system scheme if used outside the provider.
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    isDark,
    colors: isDark ? palettes.dark : palettes.light,
    toggleTheme: () => {},
  };
}
