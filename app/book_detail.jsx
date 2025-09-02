// app/book_detail.jsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../src/context/ThemeContext";
import { useBooks } from "../src/context/BooksContext";

export default function BookDetail() {
  const { color } = useTheme();
  const { id } = useLocalSearchParams();
  const { getById, removeBook } = useBooks();

  const book = useMemo(() => getById(String(id)), [id, getById]);
  if (!book) {
    return (
      <View style={[styles.center, { backgroundColor: color.background }]}>
        <Text style={{ color: color.text }}>ไม่พบบันทึกหนังสือ</Text>
        <Link href="/book" style={{ marginTop: 12 }}>
          <Text style={{ color: color.primary }}>กลับไปหน้ารายการ</Text>
        </Link>
      </View>
    );
  }

  const bid = book._id || book.id;

  const onDelete = () => {
    Alert.alert("ยืนยันลบ", `ต้องการลบ “${book.title || "หนังสือ"}” ใช่หรือไม่?`, [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          await removeBook(bid);
          router.replace("/book");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: color.background }}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* CARD */}
      <View style={[styles.card, { backgroundColor: color.surface, borderColor: color.border }]}>
        {/* Title + edit icon */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: color.text }]} numberOfLines={2}>
            {book.title || "ไม่มีชื่อ"}
          </Text>

          <Link href={{ pathname: "/book_new", params: { editId: bid } }} asChild>
            <TouchableOpacity activeOpacity={0.9} style={[styles.iconBtn, { borderColor: color.border }]}>
              <Ionicons name="pencil" size={18} color="#111827" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Author */}
        <Text style={[styles.meta, { color: color.textMuted }]}>ผู้เขียน: {book.author || "-"}</Text>

        {/* Price + Status */}
        <View style={styles.row}>
          <Text style={[styles.price, { color: color.textMuted }]}>
            ราคา: {Number(book.price || 0).toLocaleString()} บาท
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: book.available ? "#16a34a22" : "#ef444422",
                borderColor: book.available ? "#16a34a66" : "#ef444466",
              },
            ]}
          >
            <Text style={{ color: book.available ? "#16a34a" : "#ef4444", fontWeight: "800" }}>
              {book.available ? "พร้อมขาย" : "หมด"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={{ marginTop: 18 }}>
          <Text style={[styles.section, { color: color.text }]}>คำอธิบาย</Text>
          <Text style={[styles.desc, { color: color.textMuted }]}>{book.description || "—"}</Text>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onDelete}
        style={[styles.dangerBtn, styles.shadow]}
      >
        <Text style={styles.dangerText}>ลบ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },

  card: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginRight: 10,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#F4C84A",
    alignItems: "center",
    justifyContent: "center",
  },

  meta: { fontSize: 15, marginTop: 6 },

  row: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  price: { fontSize: 16 },

  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  section: { fontSize: 16, fontWeight: "800", marginBottom: 6, marginTop: 6 },

  desc: { fontSize: 15, lineHeight: 22 },

  dangerBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  dangerText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
});
