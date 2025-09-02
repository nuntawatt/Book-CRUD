// src/components/ui/Button.jsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Button({
  title,
  onPress,
  tone = "primary",
  style,
  textStyle,
  disabled,
}) {
  const { color, layout, typography } = useTheme();

  const tones = {
    primary: {
      bg: color.primary, fg: color.primaryInk, border: color.primary,
    },
    surface: {
      bg: color.surface, fg: color.text, border: color.border,
    },
    danger: {
      bg: color.danger, fg: "#fff", border: color.danger,
    },
    success: {
      bg: color.success, fg: "#fff", border: color.success,
    },
  };
  const t = tones[tone] || tones.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: t.bg,
        borderWidth: tone === "surface" ? 1 : 0,
        borderColor: t.border,
        opacity: disabled ? 0.6 : 1,
        alignItems: "center",
      }, layout.shadowLg, style]}
    >
      <Text style={[{ color: t.fg }, typography.btn, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
