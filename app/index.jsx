import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useAuth } from "../src/context/AuthContext";
import Card from "../src/components/ui/Card";
import Button from "../src/components/ui/Button";
import { Title, Subtitle, Muted } from "../src/components/ui/Text";

export default function Home() {
  const { color, layout } = useTheme();
  const { isAuthed, me, logout } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: color.background, padding: layout.pad }]}>
      <Card rounded="lg" style={{ alignItems: "center", gap: 8 }}>
        <Image source={require("../assets/image/profile.jpg")} style={styles.logo} />
        <Title>Book CRUD</Title>
        <Subtitle>จัดการหนังสือ • Create • Read • Update • Delete</Subtitle>

        <Link href="/book" asChild>
          <Button title="ไปหน้ารายการหนังสือ" />
        </Link>

        <Link href="/about" asChild>
          <Button title="About" tone="surface" />
        </Link>

        {/* Auth section */}
        <View style={{ height: 8 }} />
        {isAuthed ? (
          <>
            <Muted>คุณล็อกอินอยู่ {me?.email || ""}</Muted>
            <Button title="ออกจากระบบ" tone="surface" onPress={logout} />
          </>
        ) : (
          <>
            <Link href="/signin" asChild>
              <Button title="Sign in" tone="surface" />
            </Link>
            <Link href="/signup" asChild>
              <Button title="Sign up" tone="surface" />
            </Link>
          </>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  logo: { width: 120, height: 120, borderRadius: 24, marginBottom: 6 },
});
