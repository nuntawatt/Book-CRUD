// app/about.jsx
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useTheme } from "../src/context/ThemeContext";
import Card from "../src/components/ui/Card";
import { Title, Muted } from "../src/components/ui/Text";

export default function About() {
  const { color, layout } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: color.background, padding: layout.pad }]}>
      <Card rounded="lg" style={{ alignItems: "center", gap: 10, maxWidth: 420, alignSelf: "center" }}>
        <Image source={require("../assets/image/profile.jpg")} style={{ width: 120, height: 120, borderRadius: 24 }} />
        <Title>About Us</Title>
        <Muted style={{ textAlign: "center", lineHeight: 22 }}>
          We are passionate developers crafting clean, modern and delightful apps.
          Our mission is to build experiences that people love to use.
        </Muted>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center" } });
