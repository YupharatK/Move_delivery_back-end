// src/firebase.ts

import * as admin from 'firebase-admin';

// สร้างตัวแปรมารับค่า service account
let serviceAccount;

// ตรวจสอบว่าตอนนี้รันบน Production (เช่น Render) หรือไม่
if (process.env.NODE_ENV === 'production') {
    // ถ้าใช่, ให้ดึงค่าจาก Environment Variable
    // และต้องแน่ใจว่า GOOGLE_APPLICATION_CREDENTIALS มีค่าอยู่
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } else {
        console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
        process.exit(1); // ออกจากโปรแกรมถ้าไม่มีค่านี้
    }
} else {
    // ถ้าไม่ใช่ (รันบนเครื่องเรา), ให้อ่านจากไฟล์ .json ตามปกติ
    // *** สำคัญ: ตรวจสอบให้แน่ใจว่า path นี้ถูกต้องสำหรับโปรเจกต์ของคุณ ***
    // ถ้า serviceAccountKey.json อยู่ในโฟลเดอร์ src ให้ใช้ './serviceAccountKey.json'
    // ถ้า serviceAccountKey.json อยู่ที่ root ของโปรเจกต์ (นอก src) ให้ใช้ '../serviceAccountKey.json'
    try {
        serviceAccount = require('../serviceAccountKey.json');
    } catch (error) {
        console.error("Error loading serviceAccountKey.json for local development.", error);
        process.exit(1);
    }
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// export admin ออกไปเพื่อให้ไฟล์อื่นเรียกใช้ได้
export default admin;

// สร้างตัวแปร db และ auth จาก admin
const db = admin.firestore();
const auth = admin.auth();

// Export ออกไปเพื่อให้ไฟล์อื่นเรียกใช้แบบ { db, auth } ได้
export { db, auth };