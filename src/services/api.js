// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

/** อ่าน IP เครื่อง dev จาก Metro (ใช้กับ Expo Go) */
function getHostFromExpo() {
  const hostUri =
    (Constants && Constants.expoConfig && Constants.expoConfig.hostUri) ||
    (Constants && Constants.expoConfig && Constants.expoConfig.developer && Constants.expoConfig.developer.host) ||
    null;
  if (!hostUri) return null;          // ex: "192.168.1.61:8081"
  return hostUri.split(":")[0];       // -> "192.168.1.61"
}

/** คำนวณ BASE สำหรับโหมด dev */
function computeDevBase() {
  const host = getHostFromExpo();
  if (Platform.OS === "android") {
    // Emulator = 10.0.2.2, อุปกรณ์จริง = IP ของเครื่อง dev
    return host ? `http://${host}:3000` : "http://10.0.2.2:3000";
  }
  if (Platform.OS === "ios") {
    // Simulator = localhost, อุปกรณ์จริง = IP ของเครื่อง dev
    return host ? `http://${host}:3000` : "http://localhost:3000";
  }
  return host ? `http://${host}:3000` : "http://localhost:3000";
}

/** BASE_URL:
 * - dev: ใช้ IP ของ Metro อัตโนมัติ
 * - prod: ใช้ EXPO_PUBLIC_API_URL (กำหนดใน .env)
 */
export const BASE_URL =
  (__DEV__ ? computeDevBase() : process.env.EXPO_PUBLIC_API_URL) ||
  "http://localhost:3000";

console.log("[API] BASE_URL =", BASE_URL);

// ===== axios instance =====
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // กันเน็ตช้า
  headers: { "Content-Type": "application/json" },
});

let inMemoryToken = null;

export async function setToken(token) {
  inMemoryToken = token || null;
  if (token) {
    await AsyncStorage.setItem("@auth_token", token);
  } else {
    await AsyncStorage.removeItem("@auth_token");
  }
}

export async function getToken() {
  if (inMemoryToken) return inMemoryToken;
  const t = await AsyncStorage.getItem("@auth_token");
  inMemoryToken = t;
  return t;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const code = err && err.response && err.response.status;
    const url = err && err.config && err.config.url;
    console.warn(`API Error ${code || ""} ${url || ""}`, (err && err.response && err.response.data) || err.message);
    return Promise.reject(err);
  }
);

/** ping /health ไว้เช็คการเชื่อมต่ออย่างไว */
export async function pingHealth() {
  try {
    const r = await api.get("/health");
    console.log("[API] /health =", r.data);
    return true;
  } catch (e) {
    console.log("[API] /health failed:", (e && e.message) || e);
    return false;
  }
}

export default api;
