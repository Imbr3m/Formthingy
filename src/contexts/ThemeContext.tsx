import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import original from 'react95/dist/themes/original';
import { themeOptions } from '../assets/general/themes';

interface ThemeContextType {
  currentTheme: any;
  selectedTheme: number;
  setSelectedTheme: (theme: number) => void;
  applyTheme: (theme: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const GlobalThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<number>(1);
  const [currentTheme, setCurrentTheme] = useState(original);

  // Always start with original theme on page refresh
  useEffect(() => {
    // Clear any saved theme and reset to original
    localStorage.removeItem('selected-theme');
    setSelectedTheme(1); // Original theme
    setCurrentTheme(original);
  }, []);

  const applyTheme = (themeValue: number) => {
    const option = themeOptions.find(opt => opt.value === themeValue);
    if (option) {
      setSelectedTheme(themeValue);
      setCurrentTheme(option.theme);
      localStorage.setItem('selected-theme', themeValue.toString());
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    selectedTheme,
    setSelectedTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
