# 📚 Book CRUD App (React Native + Expo)

แอปพลิเคชัน **Book CRUD** สำหรับจัดการหนังสือ  
รองรับทั้ง **Dark/Light Mode** พร้อมระบบ **Authentication** และ CRUD หนังสือครบถ้วน 🎉  

---

## ✅ Features
- 🔑 Authentication (Sign up / Sign in) → ได้ Token แล้วแนบใน Header อัตโนมัติ  
- 📖 CRUD หนังสือ (Create / Read / Update / Delete) ผ่าน API  
- 🌙 รองรับ Dark/Light Mode  
- 🎨 UI ธีมหมึก–เหลือง สวยงาม อ่านง่าย  

---

## 🚀 การติดตั้งและรันแอป

### 1. ติดตั้ง dependencies
```bash
npm install
```

### 2. รัน Backend (API ของอาจารย์)
```bash
npm install
npm run dev
```

ค่าเริ่มต้น API จะรันที่:  
👉 `http://localhost:3000` (ใช้บนเครื่อง)  
👉 `http://192.168.x.xx:3000` (ใช้บนมือถือจริงผ่าน Expo Go)  

---

### 3. ตั้งค่า API URL
ไปที่ไฟล์ `src/services/api.js`  
```js
export const BASE_URL = "http://192.168.1.61:3000"; // เปลี่ยนเป็น IP เครื่องคุณ
```

---

### 4. รันแอป React Native
```bash
npx expo start
```

เปิด Expo Go แล้วสแกน QR Code 🚀  

---

## 🔑 การใช้งาน

### 1. ลงทะเบียน / เข้าสู่ระบบ
- ไปที่ **Sign up** → สมัครผู้ใช้ใหม่  
  - username ≥ 3 ตัวอักษร  
  - password ≥ 6 ตัวอักษร  
- ไปที่ **Sign in** → เข้าสู่ระบบ  
- เมื่อเข้าสู่ระบบสำเร็จ แอปจะเก็บ Token และแนบ `Authorization: Bearer <token>` ให้อัตโนมัติ  

---

### 2. จัดการหนังสือ (CRUD)
- **Create** → กดปุ่ม ➕ เพิ่มหนังสือ กรอกข้อมูลแล้วบันทึก  
- **Read** → ดูรายการหนังสือทั้งหมด, แตะเพื่อดูรายละเอียด  
- **Update** → กดปุ่ม ✏️ แก้ไข ที่หน้ารายละเอียด  
- **Delete** → กดปุ่ม 🗑️ ลบ ที่หน้ารายละเอียด  

---

## 🛠️ Tech Stack
- **Expo + React Native**  
- **expo-router** → Navigation  
- **Axios** → ติดต่อ API  
- **AsyncStorage** → เก็บ Token  
- **@expo-google-fonts/plus-jakarta-sans** → ฟอนต์  
- **Context API** → จัดการ Theme, Auth, Books  

---

