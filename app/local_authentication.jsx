// app/local_authentication.jsx
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import Button from "../src/components/ui/Button";
import { useTheme } from "../src/context/ThemeContext";
import { Title, Muted } from "../src/components/ui/Text";
import {
  checkBiometricCapability,
  authenticateOnce,
  isBiometricEnabled,
  setBiometricEnabled,
  markBiometricUnlocked,
} from "../src/lib/biometric";
import { useAuth } from "../src/context/AuthContext";
import { router } from "expo-router";

export default function LocalAuthScreen() {
  const { color, layout } = useTheme();
  const { refreshWithBiometric } = useAuth();
  const [cap, setCap] = useState({ hasHardware: false, isEnrolled: false, types: [] });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await checkBiometricCapability();
      setCap(c);
      setEnabled(await isBiometricEnabled());
    })();
  }, []);

  const doAuth = async () => {
    if (!cap.hasHardware || !cap.isEnrolled) {
      Alert.alert("ใช้งานไม่ได้", "อุปกรณ์ไม่รองรับหรือยังไม่ได้ตั้งค่าไบโอเมตริกซ์");
      return;
    }
    const res = await authenticateOnce("ยืนยันตัวตนเพื่อเข้าแอป");
    if (!res.success) {
      Alert.alert("ไม่ผ่าน", "ลองใหม่อีกครั้ง");
      return;
    }
    try {
      await markBiometricUnlocked();
      // 👉 ดึง accessToken ใหม่จาก refreshToken ที่เก็บไว้
      await refreshWithBiometric();
      router.replace("/book");
    } catch (e) {
      Alert.alert("เซสชันหมดอายุ", "โปรดเข้าสู่ระบบด้วยอีเมลและรหัสผ่านอีกครั้ง");
      router.replace("/signin");
    }
  };

  const onToggle = async () => {
    const next = !enabled;
    if (next) {
      if (!cap.hasHardware) return Alert.alert("ไม่รองรับ", "อุปกรณ์นี้ไม่รองรับไบโอเมตริกซ์");
      if (!cap.isEnrolled) return Alert.alert("ยังไม่ได้ตั้งค่า", "โปรดตั้งค่าลายนิ้วมือ/Face ID ในอุปกรณ์ก่อน");
      await setBiometricEnabled(true);
      setEnabled(true);
      Alert.alert("เปิดใช้งานแล้ว", "ต่อไปคุณสามารถปลดล็อกด้วยไบโอเมตริกซ์ได้");
    } else {
      await setBiometricEnabled(false);
      setEnabled(false);
      Alert.alert("ปิดใช้งานแล้ว", "ระบบจะไม่ถามไบโอเมตริกซ์อีก");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.background, padding: layout.pad, gap: 12, justifyContent: "center" }}>
      <Title>ล็อกด้วยไบโอเมตริกซ์</Title>
      <Muted>
        สถานะอุปกรณ์: {cap.hasHardware ? "รองรับ" : "ไม่รองรับ"} / {cap.isEnrolled ? "ตั้งค่าแล้ว" : "ยังไม่ได้ตั้งค่า"}
      </Muted>
      <Muted>เปิดใช้งานในแอป: {enabled ? "เปิด" : "ปิด"}</Muted>

      <Button
        title={enabled ? "🔓 ปลดล็อกตอนนี้" : "ตรวจสอบความพร้อม"}
        onPress={enabled ? doAuth : async () => {
          const c = await checkBiometricCapability(); setCap(c);
        }}
      />
      <Button title={enabled ? "ปิดใช้งานไบโอเมตริกซ์" : "เปิดใช้งานไบโอเมตริกซ์"} tone="surface" onPress={onToggle} />
      <Button title="กลับหน้าหนังสือ" tone="surface" onPress={() => router.replace("/book")} />
    </View>
  );
}
