// src/components/ui/Text.jsx
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const Title = ({ children, style, ...p }) => {
  const { color, typography } = useTheme();
  return <Text {...p} style={[{ color: color.text }, typography.h1, style]}>{children}</Text>;
};

export const Subtitle = ({ children, style, ...p }) => {
  const { color, typography } = useTheme();
  return <Text {...p} style={[{ color: color.textMuted }, typography.h2, style]}>{children}</Text>;
};

export const Muted = ({ children, style, ...p }) => {
  const { color, typography } = useTheme();
  return <Text {...p} style={[{ color: color.textMuted }, typography.muted, style]}>{children}</Text>;
};

export const Badge = ({ children, tone = "neutral", style }) => {
  const { color, typography } = useTheme();
  const map = {
    neutral: { bg: color.chipBg || "#F1F5F9", fg: color.text },
    success: { bg: "#16a34a22", fg: "#16a34a" },
    danger:  { bg: "#ef444422", fg: "#ef4444" },
  };
  const t = map[tone] || map.neutral;

  return (
    <Text style={[{
      backgroundColor: t.bg,
      color: t.fg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: "hidden",
    }, typography.muted, style]}>
      {children}
    </Text>
  );
};
