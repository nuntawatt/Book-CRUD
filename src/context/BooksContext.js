import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import api from "../services/api";

const BooksContext = createContext(null);
export const useBooks = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};

/* ---------- helpers ---------- */
const pickList = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.books)) return d.books;
  return [];
};

const pickItem = (res) => {
  const d = res?.data;
  if (d && typeof d === "object" && !Array.isArray(d)) {
    if (d._id || d.title || d.name) return d;
    if (d.book) return d.book;
    if (d.data && typeof d.data === "object") return d.data;
    if (d.item && typeof d.item === "object") return d.item;
    if (d.created && typeof d.created === "object") return d.created;
  }
  return null;
};

const getId = (o) => String(o?._id || o?.id || "");

/* ---------- provider ---------- */
export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/books");
      setBooks(pickList(res));
    } catch (e) {
      console.warn("Fetch books error:", e?.response?.data || e.message);
      Alert.alert("โหลดหนังสือไม่สำเร็จ", e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getById = (id) => books.find((b) => getId(b) === String(id));

  /* POST /api/books */
  const addBook = async (payload) => {
    try {
      const res = await api.post("/api/books", payload);
      let created = pickItem(res);

      if (!created || !getId(created)) {
        await fetchAll();
        created =
          books.find(
            (b) =>
              (b.title || b.name) === payload.title &&
              (b.author || "") === payload.author &&
              Number(b.price || 0) === Number(payload.price || 0)
          ) || null;
      } else {
        setBooks((prev) => [{ ...created }, ...prev]);
      }

      if (!created || !getId(created)) {
        throw new Error("API ไม่ได้ส่งรหัสหนังสือ (_id) กลับมา");
      }

      return created; 
    } catch (e) {
      console.warn("Create book error:", e?.response?.data || e.message);
      Alert.alert("บันทึกไม่สำเร็จ", e?.response?.data?.message || e.message);
      throw e;
    }
  };

  /** PUT /api/books/:id */
  const updateBook = async (id, patch) => {
    try {
      const res = await api.put(`/api/books/${id}`, patch);
      let updated = pickItem(res) || { ...getById(id), ...patch, _id: id };
      const uid = getId(updated);

      setBooks((prev) => prev.map((b) => (getId(b) === uid ? { ...b, ...updated } : b)));
      return updated;
    } catch (e) {
      console.warn("Update book error:", e?.response?.data || e.message);
      Alert.alert("แก้ไขไม่สำเร็จ", e?.response?.data?.message || e.message);
      throw e;
    }
  };

  /** DELETE /api/books/:id */
  const removeBook = async (id) => {
    try {
      await api.delete(`/api/books/${id}`);
      setBooks((prev) => prev.filter((b) => getId(b) !== String(id)));
    } catch (e) {
      console.warn("Delete book error:", e?.response?.data || e.message);
      Alert.alert("ลบไม่สำเร็จ", e?.response?.data?.message || e.message);
      throw e;
    }
  };

  const value = useMemo(
    () => ({ books, loading, fetchAll, getById, addBook, updateBook, removeBook }),
    [books, loading]
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}
