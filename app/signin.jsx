// app/signin.jsx
import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useAuth } from "../src/context/AuthContext";
import Button from "../src/components/ui/Button";
import { Title, Muted } from "../src/components/ui/Text";
import {
  checkBiometricCapability,
  authenticateOnce,
  isBiometricEnabled,
  setBiometricEnabled,
  markBiometricUnlocked,
} from "../src/lib/biometric";

export default function SignIn() {
  const { color, layout } = useTheme();
  const { login, isAuthed } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [bioSupported, setBioSupported] = useState(false);
  const [bioEnrolled, setBioEnrolled] = useState(false);
  const [bioEnabled, setBioEnabledLocal] = useState(false);

  useEffect(() => {
    // เช็คความพร้อมของเครื่อง + สถานะเปิดใช้
    (async () => {
      const { hasHardware, isEnrolled } = await checkBiometricCapability();
      setBioSupported(hasHardware);
      setBioEnrolled(isEnrolled);
      setBioEnabledLocal(await isBiometricEnabled());
    })();
  }, []);

  useEffect(() => {
    // ถ้าล็อกอินอยู่แล้ว ให้พาไปหน้า book
    if (isAuthed) router.replace("/book");
  }, [isAuthed]);

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
      // เสนอเปิดใช้ไบโอเมตริกซ์ครั้งแรก (ถ้าเครื่องรองรับ)
      if (bioSupported && bioEnrolled) {
        Alert.alert(
          "เปิดใช้ไบโอเมตริกซ์?",
          "ใช้ลายนิ้วมือ/Face ID เพื่อปลดล็อกเข้าแอปในครั้งถัดไป",
          [
            { text: "ภายหลัง", style: "cancel", onPress: () => router.replace("/book") },
            {
              text: "เปิดใช้เลย",
              onPress: async () => {
                await setBiometricEnabled(true);
                setBioEnabledLocal(true);
                router.replace("/book");
              },
            },
          ]
        );
      } else {
        router.replace("/book");
      }
    } catch (err) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", err?.response?.data?.message || err?.message || "กรุณาตรวจสอบอีเมลและรหัสผ่าน");
    } finally {
      setSubmitting(false);
    }
  };

  const onUnlockWithBiometric = async () => {
    if (!bioSupported || !bioEnrolled) {
      Alert.alert("ใช้งานไม่ได้", "อุปกรณ์ไม่รองรับหรือยังไม่ได้ตั้งค่าลายนิ้วมือ/Face ID");
      return;
    }
    try {
      const res = await authenticateOnce("ยืนยันตัวตนเพื่อเข้าแอป");
      if (res.success) {
        await markBiometricUnlocked();
        // ตรงนี้ถือเป็น "ปลดล็อก UI" — ใช้ได้ก็ต่อเมื่อเซสชันฝั่ง Auth ยัง Valid
        router.replace("/book");
      } else {
        Alert.alert("ยกเลิกหรือไม่ผ่าน", "ลองใหม่อีกครั้ง");
      }
    } catch {
      Alert.alert("ผิดพลาด", "ไม่สามารถยืนยันตัวตนได้");
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

        {/* ปุ่มปลดล็อกด้วยไบโอเมตริกซ์ (กรณีเปิดใช้ไว้) */}
        {bioEnabled && bioSupported && bioEnrolled && (
          <Button title="🔓 ปลดล็อกด้วยไบโอเมตริกซ์" tone="surface" onPress={onUnlockWithBiometric} />
        )}

        <View style={{ height: 8 }} />
        <Link href="/signup" asChild>
          <Button title="ยังไม่มีบัญชี? สมัครสมาชิก" tone="surface" />
        </Link>

        {!bioEnabled && bioSupported && !bioEnrolled && (
          <Muted style={{ marginTop: 8 }}>
            * ต้องตั้งค่าลายนิ้วมือ/Face ID ในเครื่องก่อน จึงจะเปิดใช้ได้
          </Muted>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
