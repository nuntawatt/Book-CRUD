// src/components/ui/BookCard.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Title, Muted, Badge } from "./Text";

export default function BookCard({ item, onPress }) {
  const { color, layout } = useTheme();
  const available = !!item.available;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={{
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.border,
        borderRadius: layout.radiusLg,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <View
          style={{
            width: 54, height: 54, borderRadius: 12,
            backgroundColor: color.surfaceAlt,
            alignItems: "center", justifyContent: "center",
            borderWidth: 1, borderColor: color.border,
          }}
        >
          <Text style={{ fontSize: 22 }}>📘</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Title numberOfLines={1} style={{ fontSize: 16 }}>
            {item.title || item.name || "ไม่มีชื่อ"}
          </Title>
          <Muted numberOfLines={1}>โดย {item.author || "-"}</Muted>

          <View style={{ marginTop: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Muted>฿{Number(item.price || 0).toLocaleString()}</Muted>
            <Badge tone={available ? "success" : "danger"}>
              {available ? "พร้อมขาย" : "หมด"}
            </Badge>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
