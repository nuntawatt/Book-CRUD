// app/signin.jsx
import React, { useState } from "react";
import { View, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useAuth } from "../src/context/AuthContext";
import Button from "../src/components/ui/Button";
import { Title, Muted } from "../src/components/ui/Text";

export default function SignIn() {
  const { color, layout } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
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
    const e = email.trim();
    if (!e || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "โปรดกรอกอีเมลและรหัสผ่าน");
      return;
    }
    try {
      setSubmitting(true);
      await login(e, password);          
      router.replace("/book");
    } catch (err) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", err?.response?.data?.message || err?.message || "กรุณาตรวจสอบอีเมลและรหัสผ่าน");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: color.background, padding: layout.pad, gap: 10 }}>
        <Title>เข้าสู่ระบบ</Title>

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

        <Button title={submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"} onPress={onSubmit} disabled={submitting} />

        <Muted style={{ marginTop: 8 }}>
          เมื่อเข้าสู่ระบบแล้ว ทุกคำขอ API จะมี Authorization: Bearer &lt;token&gt; ให้อัตโนมัติ
        </Muted>

        <View style={{ height: 8 }} />
        <Link href="/signup" asChild>
          <Button title="ยังไม่มีบัญชี? สมัครสมาชิก" tone="surface" />
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
