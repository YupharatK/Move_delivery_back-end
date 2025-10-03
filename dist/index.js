"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
require("./firebase");
// Import controller
const userController_1 = require("./controllers/userController");
const authMiddleware_1 = require("./middlewares/authMiddleware");
// ... import controllers อื่นๆ
const app = (0, express_1.default)();
app.use(express_1.default.json());
// --- Routes for User ---
// เมื่อมี HTTP POST request มาที่ URL '/users' ให้เรียกใช้ฟังก์ชัน createUser
app.post('/users', userController_1.createUser);
app.get('/users/me', authMiddleware_1.isAuthenticated, userController_1.getUserProfile);
// ... routes อื่นๆ
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map