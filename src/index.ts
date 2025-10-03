// src/index.ts
import express from 'express';
import './firebase'; 

// Import controller
import { createUser, getUserProfile } from './controllers/userController';
import { isAuthenticated } from './middlewares/authMiddleware';
// ... import controllers อื่นๆ

const app = express();
app.use(express.json());

// --- Routes for User ---
// เมื่อมี HTTP POST request มาที่ URL '/users' ให้เรียกใช้ฟังก์ชัน createUser
app.post('/users', createUser);
app.get('/users/me', isAuthenticated, getUserProfile);

// ... routes อื่นๆ

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});