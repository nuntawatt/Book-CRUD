// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import api, { setToken as applyToken, getToken as readToken } from "../services/api";
import {
  saveRefreshBundle,
  clearRefreshBundle,
  getRefreshToken,
} from "../lib/biometric";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/profile");
      setMe(res.data || null);
    } catch {
      setMe(null);
    }
  }, []);

  // โหลด token จาก storage แล้วดึงโปรไฟล์
  useEffect(() => {
    (async () => {
      setLoading(true);
      const t = await readToken();
      if (t) {
        setTokenState(t);
        await fetchProfile();
      }
      setLoading(false);
    })();
  }, [fetchProfile]);

  // POST /api/auth/register
  const register = async ({ username, email, password }) => {
    await api.post("/api/auth/register", { username, email, password });
    return true;
  };

  // POST /api/auth/login → { token, refreshToken?, user? }
  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const t = res?.data?.token;
    if (!t) throw new Error("Login success but token not found");

    await applyToken(t);
    setTokenState(t);

    const rtoken = res?.data?.refreshToken;
    if (rtoken) {
      await saveRefreshBundle({ refreshToken: rtoken, email });
    }

    if (res?.data?.user) setMe(res.data.user);
    else await fetchProfile();

    return true;
  };

  const refreshWithBiometric = useCallback(async () => {
    const rtoken = await getRefreshToken();
    if (!rtoken) throw new Error("No refresh token");

    const res = await api.post("/api/auth/refresh", { refreshToken: rtoken });
    const t = res?.data?.token;
    if (!t) throw new Error("Refresh failed");

    await applyToken(t);
    setTokenState(t);

    if (res?.data?.user) setMe(res.data.user);
    else await fetchProfile();

    return true;
  }, [fetchProfile]);

  const logout = async () => {
    await applyToken(null);
    setTokenState(null);
    setMe(null);
    await clearRefreshBundle();
  };

  const value = useMemo(
    () => ({
      token,
      me,
      loading,
      isAuthed: !!token,   
      register,
      login,
      logout,
      refreshWithBiometric,    
      fetchMe: fetchProfile,
    }),
    [token, me, loading, refreshWithBiometric, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
