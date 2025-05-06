import express from "express";
import { adminLogin, getAllUsers, login, myProfile, signup } from "../controllers/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.get("/myProfile", authMiddleware, myProfile);
router.get(
  "/all-users",
  authMiddleware,
  getAllUsers
);

export default router;
