import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
 * BASE_URL:
 * - iOS Simulator (Mac) → http://localhost:3000
 * - Android Emulator → http://10.0.2.2:3000
 * IPv4 : 192.168.1.61
 */

export const BASE_URL = "http://192.168.1.61:3000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let inMemoryToken = null;

export async function setToken(token) {
  inMemoryToken = token;
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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const code = err?.response?.status;
    const url = err?.config?.url;
    console.warn(
      `API Error ${code || ""} ${url || ""}`,
      err?.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

export default api;
