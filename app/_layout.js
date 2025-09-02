import { Stack } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import {
  useFonts,
  PlusJakartaSans_400Regular as PJS_400,
  PlusJakartaSans_500Medium as PJS_500,
  PlusJakartaSans_700Bold as PJS_700,
  PlusJakartaSans_800ExtraBold as PJS_800,
} from "@expo-google-fonts/plus-jakarta-sans";

import ThemeToggle from "../src/components/ThemeToggle";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";
import { BooksProvider } from "../src/context/BooksContext";
import { AuthProvider } from "../src/context/AuthContext";

function BrandTitle() {
  const { color } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text style={{ color: color.text, fontFamily: "PJS_700" }}>BOOK CRUD</Text>
    </View>
  );
}

function StackLayout() {
  const { isDarkMode, color } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.background },
          headerShadowVisible: false,
          headerTintColor: color.text,
          headerTitleStyle: { color: color.text },
          contentStyle: { backgroundColor: color.background },
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home", headerTitle: () => <BrandTitle /> }} />
        <Stack.Screen name="book" options={{ title: "Books", headerTitle: () => <BrandTitle /> }} />
        <Stack.Screen name="book_detail" options={{ title: "รายละเอียดหนังสือ" }} />
        <Stack.Screen name="book_new" options={{ title: "เพิ่ม/แก้ไข หนังสือ" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="signin" options={{ title: "Sign in" }} />
        <Stack.Screen name="signup" options={{ title: "Sign up" }} />
      </Stack>
    </>
  );
}

function Root() {
  const [loaded] = useFonts({ PJS_400, PJS_500, PJS_700, PJS_800 });
  if (!loaded) return null;
  return (
    <AuthProvider>
      <BooksProvider>
        <StackLayout />
      </BooksProvider>
    </AuthProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
