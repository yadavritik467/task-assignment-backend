import express from "express";
import {
  createTask,
  deleteMyTask,
  getAllTasks,
  getSingleTask,
  updateTask,
} from "../controllers/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-task", authMiddleware, createTask);

router.put("/update-task", authMiddleware, updateTask);
router.delete("/delete-task", authMiddleware, deleteMyTask);

router.get("/single-task/:id", authMiddleware, getSingleTask);
router.get("/all-tasks", authMiddleware, getAllTasks);

export default router;
