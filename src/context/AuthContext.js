import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setToken, getToken } from "../services/api";

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

  // Loading token from storage
  useEffect(() => {
    (async () => {
      const t = await getToken();
      if (t) setTokenState(t);
      setLoading(false);
    })();
  }, []);

  // POST /api/auth/register
  const register = async ({ username, email, password }) => {
    await api.post("/api/auth/register", { username, email, password });
    return true;
  };

  // POST /api/auth/login → { token }
  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const t = res?.data?.token;
    if (!t) throw new Error("Login success but token not found");

    await setToken(t);
    setTokenState(t);

    try {
      const meRes = await api.get("/api/auth/profile");
      setMe(meRes.data);
    } catch (_) {}
    return true;
  };

  const logout = async () => {
    await setToken(null);
    setTokenState(null);
    setMe(null);
  };

  const value = useMemo(
    () => ({ token, me, loading, isAuthed: !!token, register, login, logout }),
    [token, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
