// app/book_new.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useBooks } from "../src/context/BooksContext";
import { useAuth } from "../src/context/AuthContext";

export default function BookNewOrEdit() {
  const { color, layout } = useTheme();
  const { addBook, updateBook, getById } = useBooks();
  const { isAuthed } = useAuth();

  const { editId } = useLocalSearchParams();
  const editing = !!editId;

  const existing = useMemo(
    () => (editing ? getById(String(editId)) : null),
    [editing, editId, getById]
  );

  const [title, setTitle] = useState(existing?.title ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [price, setPrice] = useState(String(existing?.price ?? ""));
  const [available, setAvailable] = useState(existing?.available ?? true);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title ?? "");
      setAuthor(existing.author ?? "");
      setPrice(String(existing.price ?? ""));
      setAvailable(!!existing.available);
      setDescription(existing.description ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?._id]);

  const inputBox = {
    borderWidth: 1,
    borderRadius: layout.radius,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: color.border,
    backgroundColor: color.surface,
    color: color.text,
  };

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "โปรดกรอกชื่อหนังสือ");
      return;
    }
    if (!isAuthed) {
      Alert.alert("ต้องเข้าสู่ระบบ", "การบันทึก/แก้ไข ต้องเข้าสู่ระบบก่อน", [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ไปหน้า Sign in", onPress: () => router.push("/signin") },
      ]);
      return;
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      price: Number(price) || 0,
      available,
      description: description.trim(),
    };

    try {
      setSubmitting(true);
      if (editing && existing?._id) {
        const updated = await updateBook(existing._id, payload);
        router.replace({ pathname: "/book_detail", params: { id: updated._id } });
      } else {
        const created = await addBook(payload);
        router.replace({ pathname: "/book_detail", params: { id: created._id } });
      }
    } catch (e) {
      Alert.alert(
        "บันทึกไม่สำเร็จ",
        e?.response?.data?.message || e?.response?.data?.error || e?.message || "เกิดข้อผิดพลาด"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: color.background }}
    >
      <ScrollView contentContainerStyle={{ padding: layout.pad }} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: color.text }]}>
          {editing ? "แก้ไขหนังสือ" : "เพิ่มหนังสือใหม่"}
        </Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: color.text }]}>ชื่อหนังสือ *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="เช่น Clean Code"
            placeholderTextColor={color.textMuted}
            style={inputBox}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: color.text }]}>ผู้เขียน</Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="เช่น Robert C. Martin"
            placeholderTextColor={color.textMuted}
            style={inputBox}
            returnKeyType="next"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: color.text }]}>ราคา (บาท)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              inputMode="numeric"
              placeholder="เช่น 450"
              placeholderTextColor={color.textMuted}
              style={inputBox}
              returnKeyType="done"
            />
          </View>

          <View style={[styles.field, styles.switchField, { borderColor: color.border }]}>
            <Text style={[styles.label, { color: color.text, marginBottom: 0 }]}>พร้อมขาย</Text>
            <Switch value={available} onValueChange={setAvailable} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: color.text }]}>คำอธิบาย</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="รายละเอียดหรือคำโปรยของหนังสือ"
            placeholderTextColor={color.textMuted}
            style={[inputBox, styles.textarea]}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          onPress={onSave}
          disabled={submitting}
          style={[styles.button, { backgroundColor: color.primary, opacity: submitting ? 0.7 : 1 }]}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>{submitting ? "กำลังบันทึก..." : editing ? "บันทึกการแก้ไข" : "บันทึก"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  field: { marginBottom: 12 },
  label: { fontWeight: "700", marginBottom: 6 },
  textarea: { minHeight: 110, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  switchField: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#111827", fontWeight: "800", fontSize: 16 },
});
