import * as admin from 'firebase-admin';

// ตรวจสอบว่ามี Environment Variable ที่ชื่อ GOOGLE_APPLICATION_CREDENTIALS หรือไม่
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
}

// นำข้อมูล JSON string จาก Environment Variable มาแปลงเป็น Object
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// นำข้อมูลที่ได้มาใช้ในการเชื่อมต่อ Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export Firestore และ Auth เพื่อนำไปใช้ในไฟล์อื่น
export const db = admin.firestore();
export const auth = admin.auth();

// แสดงข้อความเมื่อเชื่อมต่อสำเร็จ
console.log('Firebase Admin SDK initialized successfully!');