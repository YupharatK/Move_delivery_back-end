import type { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase'; // Import auth จาก firebase admin
import type { DecodedIdToken } from 'firebase-admin/auth';

// เพิ่ม property 'user' เข้าไปใน Request type ของ Express เพื่อให้ TypeScript รู้จัก
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

/**
 * @description Middleware สำหรับตรวจสอบ Firebase ID Token ที่ส่งมาใน Header
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // ใช้ auth.verifyIdToken() เพื่อตรวจสอบความถูกต้องของ token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // ถ้าถูกต้อง, แนบข้อมูล user ที่ถอดรหัสแล้ว (decodedToken) ไปกับ Request
    req.user = decodedToken;
    
    // ส่งต่อไปยังฟังก์ชัน Controller ตัวถัดไป
    next();
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid token.' });
  }
};