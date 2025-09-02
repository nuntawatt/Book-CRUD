import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(v => !v);

  const color = {
    background: isDarkMode ? "#0C111B" : "#F6F7F9",
    surface:    isDarkMode ? "#141B2E" : "#FFFFFF",
    surfaceAlt: isDarkMode ? "#0F1626" : "#F9FAFB",
    text:       isDarkMode ? "#E8EAF0" : "#0F172A",
    textMuted:  isDarkMode ? "#9BA7B7" : "#64748B",
    primary:    "#F4C84A",   
    primaryInk: "#111827",
    success:    "#16a34a",
    danger:     "#ef4444",
    border:     isDarkMode ? "#22304A" : "#E5E7EB",
    chipBg:     isDarkMode ? "#1F2937" : "#FFF6D6",
    shadow:     "#0b1220",
  };

  const layout = {
    radius: 16,
    radiusLg: 22,
    pad: 16,
    gap: 12,
    shadowLg: {
      shadowColor: color.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },
  };

  const typography = {
    h1:   { fontFamily: "PJS_800", fontSize: 22 },
    h2:   { fontFamily: "PJS_700", fontSize: 18 },
    body: { fontFamily: "PJS_500", fontSize: 14 },
    muted:{ fontFamily: "PJS_500", fontSize: 13 },
    btn:  { fontFamily: "PJS_800", fontSize: 16 },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, color, layout, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};
