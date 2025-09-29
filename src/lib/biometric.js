// src/lib/biometric.js
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_BIO_ENABLED = "BIO_ENABLED_V1";
const KEY_BIO_LAST_AUTH_AT = "BIO_LAST_AUTH_AT";

// เก็บข้อมูลสำหรับ “ล็อกอินอัตโนมัติหลังไบโอเมตริกซ์”
const KEY_REFRESH_TOKEN = "SEC_REFRESH_TOKEN";
const KEY_EMAIL_HINT = "SEC_EMAIL_HINT"; 

export async function checkBiometricCapability() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;
  const types = hasHardware ? await LocalAuthentication.supportedAuthenticationTypesAsync() : [];
  return { hasHardware, isEnrolled, types };
}

export async function authenticateOnce(promptMessage = "ยืนยันตัวตน") {
  return LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: "ใช้รหัสผ่านอุปกรณ์",
    cancelLabel: "ยกเลิก",
    disableDeviceFallback: false,
  });
}

export async function setBiometricEnabled(enabled) {
  if (enabled) {
    await AsyncStorage.setItem(KEY_BIO_ENABLED, "1");
  } else {
    await AsyncStorage.removeItem(KEY_BIO_ENABLED);
    await SecureStore.deleteItemAsync(KEY_BIO_LAST_AUTH_AT);
    await SecureStore.deleteItemAsync(KEY_REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEY_EMAIL_HINT);
  }
}

export async function isBiometricEnabled() {
  const v = await AsyncStorage.getItem(KEY_BIO_ENABLED);
  return v === "1";
}

export async function markBiometricUnlocked() {
  await SecureStore.setItemAsync(KEY_BIO_LAST_AUTH_AT, String(Date.now()));
}
export async function getLastBiometricUnlockedAt() {
  return Number((await SecureStore.getItemAsync(KEY_BIO_LAST_AUTH_AT)) || 0);
}

// ====== เก็บ/อ่านค่าเพื่อ login อัตโนมัติ ======
export async function saveRefreshBundle({ refreshToken, email }) {
  if (refreshToken) await SecureStore.setItemAsync(KEY_REFRESH_TOKEN, refreshToken);
  if (email) await SecureStore.setItemAsync(KEY_EMAIL_HINT, email);
}
export async function getRefreshToken() {
  return SecureStore.getItemAsync(KEY_REFRESH_TOKEN);
}
export async function getEmailHint() {
  return SecureStore.getItemAsync(KEY_EMAIL_HINT);
}
export async function clearRefreshBundle() {
  await SecureStore.deleteItemAsync(KEY_REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(KEY_EMAIL_HINT);
}
