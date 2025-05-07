import express from "express";
import {
  createTask,
  deleteMyTask,
  getAllTasks,
  updateTask,
} from "../controllers/Task.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-task", authMiddleware, createTask);

router.put("/update-task/:id", authMiddleware, updateTask);
router.delete("/delete-task/:id", authMiddleware, deleteMyTask);

router.get("/all-tasks", authMiddleware, getAllTasks);

export default router;
