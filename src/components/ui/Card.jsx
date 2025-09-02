// src/components/ui/Card.jsx
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Card({ children, style, rounded = "xl" }) {
  const { color, layout } = useTheme();
  const radius = rounded === "lg" ? layout.radius : layout.radiusLg;
  return (
    <View
      style={[{
        backgroundColor: color.surface,
        borderRadius: radius,
        borderWidth: 1,
        borderColor: color.border,
        padding: 16,
      }, layout.shadowLg, style]}
    >
      {children}
    </View>
  );
}
