// app/signup.jsx
import React, { useState } from "react";
import { View, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useAuth } from "../src/context/AuthContext";
import Button from "../src/components/ui/Button";
import { Title, Muted } from "../src/components/ui/Text";

export default function SignUp() {
  const { color, layout } = useTheme();
  const { register, login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: layout.radius,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: color.surface,
    color: color.text,
  };

  const onSubmit = async () => {
    const u = username.trim();
    const e = email.trim();
    if (!u || !e || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "โปรดกรอกชื่อผู้ใช้ อีเมล และรหัสผ่าน");
      return;
    }
    try {
      setSubmitting(true);
      // POST /api/auth/register { username, email, password }
      await register({ username: u, email: e, password });
      await login(e, password);
      router.replace("/book");
    } catch (err) {
      Alert.alert("สมัครสมาชิกไม่สำเร็จ", err?.response?.data?.message || err?.message || "โปรดลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: color.background, padding: layout.pad, gap: 10 }}>
        <Title>สมัครสมาชิก</Title>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={color.textMuted}
          autoCapitalize="none"
          returnKeyType="next"
          style={inputStyle}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={color.textMuted}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          returnKeyType="next"
          style={inputStyle}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={color.textMuted}
          secureTextEntry
          returnKeyType="done"
          style={inputStyle}
          onSubmitEditing={onSubmit}
        />

        <Button title={submitting ? "กำลังสมัคร..." : "สมัครสมาชิก"} onPress={onSubmit} disabled={submitting} />

        <Muted style={{ marginTop: 8 }}>
          เมื่อสมัครสำเร็จ ระบบจะเข้าสู่ระบบให้อัตโนมัติ
        </Muted>
      </View>
    </KeyboardAvoidingView>
  );
}
