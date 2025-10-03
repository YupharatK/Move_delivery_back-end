import type { Request, Response } from 'express';
import { db } from '../firebase';

/**
 * @description สร้างข้อมูลผู้ใช้ใน Firestore หลังจากสมัครผ่าน Auth สำเร็จ
 * @route POST /users
 * @access Public
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // 1. ดึงข้อมูลที่ Frontend ส่งมาให้จาก Request Body
    const { uid, name, phone, role } = req.body;

    // 2. ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!uid || !name || !phone || !role) {
      return res.status(400).json({ message: 'Missing required fields: uid, name, phone, role' });
    }

    // 3. เตรียมข้อมูลที่จะบันทึกลง Firestore
    const userData = {
      name,
      phone,
      role,
      created_at: new Date(),
      updated_at: new Date(),
      // user_photo จะถูกเพิ่มเข้ามาทีหลังเมื่อมีการอัปโหลด
    };

    // 4. สั่งให้ Firestore สร้าง Document โดยใช้ uid เป็น ID ของ Document
    await db.collection('users').doc(uid).set(userData);

    // 5. ส่ง Response กลับไปให้ Frontend ว่าทำสำเร็จแล้ว
    res.status(201).json({ message: `User profile for ${name} created successfully.` });

  } catch (error) {
    console.error("Error creating user profile:", error);
    res.status(500).json({ message: 'Failed to create user profile.' });
  }
};

/**
 * @description ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ Login อยู่ พร้อม role
 * @route GET /users/me
 * @access Private (ต้องใช้ Token)
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;

    if (!uid) {
      return res.status(400).json({
        message: 'Invalid request: User ID not found in token.',
      });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'User profile not found in Firestore.',
        suggestion: 'Register this user or sync profile after login.',
      });
    }

    const userData = userDoc.data() || {};

    // เพิ่ม role ลงไป
    const role = userData.role || "user"; // กำหนด default เป็น "user" หากไม่มีค่า role

    res.status(200).json({
      id: userDoc.id,
      email,
      role,
      ...userData,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      message: 'Failed to fetch user profile.',
      error: (error as Error).message,
    });
  }
};

