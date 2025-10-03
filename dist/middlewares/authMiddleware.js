"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const firebase_1 = require("../firebase"); // Import auth จาก firebase admin
/**
 * @description Middleware สำหรับตรวจสอบ Firebase ID Token ที่ส่งมาใน Header
 */
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        // ใช้ auth.verifyIdToken() เพื่อตรวจสอบความถูกต้องของ token
        const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
        // ถ้าถูกต้อง, แนบข้อมูล user ที่ถอดรหัสแล้ว (decodedToken) ไปกับ Request
        req.user = decodedToken;
        // ส่งต่อไปยังฟังก์ชัน Controller ตัวถัดไป
        next();
    }
    catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid token.' });
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authMiddleware.js.map