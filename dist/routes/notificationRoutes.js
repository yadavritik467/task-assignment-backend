import express from "express";
import { MarkAllAsRead, AllNotification, } from "../controllers/NotificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.put("/mark-all-as-read", authMiddleware, MarkAllAsRead);
router.get("/user-notification", authMiddleware, AllNotification);
export default router;
