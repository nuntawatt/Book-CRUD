📚 Book CRUD App (React Native + Expo)
แอปพลิเคชัน Book CRUD สำหรับจัดการหนังสือ
✅ Authentication (Sign up / Sign in) → ได้ Token แล้วแนบใน Header อัตโนมัติ
✅ CRUD หนังสือ (Create / Read / Update / Delete) ผ่าน API
✅ รองรับ Dark/Light Mode
✅ UI ธีมหมึก–เหลือง สวยงามอ่านง่าย

🚀 การติดตั้งและรันแอป
1. ติดตั้ง dependencies
- npm install
2. รัน Backend (ของอาจารย์)
- npm install
- npm run dev
- Backend จะรันที่ http://localhost:3000
3. ตั้งค่า API
src/services/api.js
- export const BASE_URL = "http://192.168.1.61:3000";
4. รันแอป
- npx expo start

🔑 การใช้งาน
1. ลงทะเบียน / เข้าสู่ระบบ
- ไปที่ Sign up → สมัครผู้ใช้ใหม่ (username ≥ 3 ตัวอักษร, password ≥ 6 ตัวอักษร)
- ไปที่ Sign in → เข้าสู่ระบบ
- เมื่อเข้าสู่ระบบสำเร็จ แอปจะเก็บ Token และใส่ Authorization: Bearer <token> อัตโนมัติในทุก request

2. จัดการหนังสือ (CRUD)
- Create → กดปุ่ม + เพิ่มหนังสือ กรอกข้อมูลแล้วบันทึก
- Read → ดูรายการหนังสือทั้งหมด, แตะเพื่อดูรายละเอียด
- Update → กดปุ่ม แก้ไข ที่หน้ารายละเอียด
- Delete → กดปุ่ม ลบ ที่หน้ารายละเอียด

🛠️ Tech Stack
- Expo
 + React Native
- expo-router
 สำหรับ Navigation
- Axios
 สำหรับเชื่อมต่อ API
- AsyncStorage
 สำหรับเก็บ Token
- @expo-google-fonts/plus-jakarta-sans
 ใช้ฟอนต์สวย ๆ
- Context API → จัดการ Theme, Auth, Books

📂 โครงสร้างไฟล์
app/
 ├─ _layout.js          # Navigation Stack + Theme Toggle
 ├─ index.jsx           # หน้า Home
 ├─ signin.jsx          # หน้าเข้าสู่ระบบ
 ├─ signup.jsx          # หน้าสมัคร
 ├─ book.jsx            # List หนังสือ
 ├─ book_new.jsx        # เพิ่ม/แก้ไข หนังสือ
 ├─ book_detail.jsx     # รายละเอียดหนังสือ
 └─ about.jsx           # หน้า About

src/
 ├─ context/
 │   ├─ AuthContext.js   # จัดการ Auth + Token
 │   ├─ BooksContext.js  # จัดการ Books CRUD
 │   └─ ThemeContext.js  # จัดการ Theme
 ├─ services/
 │   └─ api.js           # Axios instance + Interceptor ใส่ Bearer token
 └─ components/
     └─ ui/              # UI Components (Button, Card, Text, BookCard, ThemeToggle)

✨ ฟีเจอร์
- Login / Register ด้วย API + เก็บ Token
- CRUD หนังสือ (เพิ่ม, แก้ไข, ลบ, ดูรายละเอียด)
- Dark/Light mode สลับได้
- UI สวยงาม ใช้ธีมหมึก–เหลือง อ่านง่าย