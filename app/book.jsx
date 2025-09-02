// app/book.jsx
import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, TextInput, RefreshControl } from "react-native";
import { Link, router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useBooks } from "../src/context/BooksContext";
import { useAuth } from "../src/context/AuthContext";
import Button from "../src/components/ui/Button";
import { Title, Muted } from "../src/components/ui/Text";
import BookCard from "../src/components/ui/BookCard";

export default function BookList() {
  const { color, layout } = useTheme();
  const { books, loading, fetchAll } = useBooks();
  const { isAuthed } = useAuth();

  const [q, setQ] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    let f = Array.isArray(books) ? books : [];
    if (s) f = f.filter((b) =>
      [(b.title || b.name || ""), b.author || "", b.description || ""]
        .join(" ").toLowerCase().includes(s)
    );
    if (onlyAvailable) f = f.filter((b) => !!b.available);
    return f;
  }, [books, q, onlyAvailable]);

  const onCreate = () => {
    if (!isAuthed) {
      router.push("/signin");
      return;
    }
    router.push("/book_new");
  };

  const refresh = useCallback(() => { fetchAll(); }, [fetchAll]);

  return (
    <View style={[styles.container, { backgroundColor: color.background, padding: layout.pad }]}>
      <View style={styles.headerRow}>
        <Title>📚 ห้องสมุดหนังสือ</Title>
        <Button title="+ เพิ่มหนังสือ" onPress={onCreate} />
      </View>

      <TextInput
        placeholder="ค้นหา: ชื่อ/ผู้เขียน/คำอธิบาย"
        placeholderTextColor={color.textMuted}
        value={q}
        onChangeText={setQ}
        style={[
          styles.input,
          { backgroundColor: color.surface, color: color.text, borderColor: color.border, borderRadius: layout.radius },
        ]}
        returnKeyType="search"
        autoCapitalize="none"
      />

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <Button
          title={onlyAvailable ? "✓ เฉพาะพร้อมขาย" : "เฉพาะพร้อมขาย"}
          tone={onlyAvailable ? "success" : "surface"}
          onPress={() => setOnlyAvailable(v => !v)}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item._id || item.id)}
        renderItem={({ item }) => (
          <BookCard
            item={item}
            onPress={() => router.push({ pathname: "/book_detail", params: { id: item._id || item.id } })}
          />
        )}
        ListEmptyComponent={() => (
          <Muted style={{ textAlign: "center", marginTop: 40 }}>
            {loading ? "กำลังโหลด..." : "ยังไม่มีหนังสือ กด “เพิ่มหนังสือ” เพื่อเริ่มต้น"}
          </Muted>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={color.textMuted} />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 },
});
