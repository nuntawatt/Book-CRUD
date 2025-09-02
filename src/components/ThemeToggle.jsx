import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, color } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.85}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
        borderWidth: 1,
        borderColor: color.border,
      }}
    >
      <Text style={{ color: color.text }}>{isDarkMode ? "🌙 Dark" : "☀️ Light"}</Text>
    </TouchableOpacity>
  );
}
