// src/firebase.ts
import * as admin from 'firebase-admin';

// บรรทัดนี้สำคัญมาก: มันจะอ่านไฟล์ "กุญแจ" ที่เราวางไว้ข้างนอก
// '../' หมายถึงให้ถอยออกจากโฟลเดอร์ src ไป 1 ชั้น
import serviceAccount from '../serviceAccountKey.json'; 

// ทำการเชื่อมต่อด้วยข้อมูลจากกุญแจ
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

// Export Firestore และ Auth เพื่อนำไปใช้ในไฟล์อื่น
export const db = admin.firestore();
export const auth = admin.auth();

// แสดงข้อความเมื่อเชื่อมต่อสำเร็จ
console.log('Firebase Admin SDK initialized successfully!');