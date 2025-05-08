import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
import Task from "../models/Task.js";
import { getIO } from "../utils/socket.js";
import { ROLES, SOCKETEVENT, STATUS } from "../enums/enum.js";
import Notification from "../models/Notification.js";

export const createTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      assignedName,
    } = req.body;
    if (!title) return next(new AppError("Title is required", 400));
    else if (!description)
      return next(new AppError("Description is required", 400));
    else if (!assignedTo)
      return next(new AppError("Assigning user is required", 400));
    else if (!dueDate) return next(new AppError("Due Date is required", 400));

    await Task.create({
      title,
      description,
      assignedTo,
      dueDate: new Date(dueDate),
      status,
      priority,
      createdBy: req?.user?._id,
    });

    const { io, userSocketMap } = getIO();
    const socketId = userSocketMap.get(`${assignedTo}`);

    const task_created_by = req?.user?.name;
    const message = `Hey ${assignedName} , A new task has been assigned to you by ${task_created_by} .`;

    await Notification.create({
      userId: assignedTo,
      message,
    });

    if (socketId) {
      io.to(socketId).emit(SOCKETEVENT.TASK_CREATED, { message });
    }

    return sendResponse(res, 201, "Task created Successfully");
  }
);

export const updateTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
      assignedName,
    } = req.body;
    let task = await Task.findById(id);
    if (!task) return next(new AppError("Task Not Found", 404));

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (dueDate) {
      task.dueDate = new Date(dueDate);
    }
    if (priority) {
      task.priority = priority;
    }
    if (assignedTo) {
      task.assignedTo = assignedTo;
    }
    if (status) {
      task.status = status;
    }
    await task.save();

    if (assignedTo) {
      const { io, userSocketMap } = getIO();
      const socketId = userSocketMap.get(`${assignedTo}`);

      const task_created_by = req?.user?.name;
      const message = `Hey ${assignedName} , An existing task has been assigned to you by ${task_created_by} .`;

      await Notification.create({
        userId: assignedTo,
        message,
      });

      if (socketId) {
        io.to(socketId).emit(SOCKETEVENT.TASK_UPDATED, { message });
      }
    }
    return sendResponse(res, 200, "Task Updated");
  }
);
export const deleteMyTask = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const myTask = await Task.findById(id);
    if (!myTask) return next(new AppError("Task already Deleted", 404));

    await Task.findByIdAndDelete(id);
    return sendResponse(res, 200, "Task Deleted");
  }
);

export const getAllTasks = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const search = req?.query?.search || "";
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const status = req.query.status?.toString();
    const dueDate = req.query.dueDate?.toString();
    const priority = req.query.priority?.toString();
    const myUserId = req.query.myUserId?.toString();
    const createdBy = req.query.createdBy?.toString();

    const searchFilter: any = {};

    if (search) {
      searchFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      searchFilter.status = status;
    }
    if (priority) {
      searchFilter.priority = priority;
    }
    if (myUserId) {
      searchFilter.assignedTo = myUserId;
    }
    if (createdBy) {
      searchFilter.createdBy = createdBy;
    }

    if (dueDate) {
      const now = new Date();
      searchFilter.status = { $ne: STATUS.COMPLETED };
      searchFilter.dueDate = {
        $lt: now,
      };
    }

    const allTasks = await Task.find({ ...searchFilter })
      .populate("assignedTo", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const assignedFilter =
      req?.user.role === ROLES.USER ? { assignedTo: req?.user?._id } : {};

    const inProgressTaskCount = await Task.countDocuments({
      ...assignedFilter,
      status: STATUS.INPROGRESS,
    });
    const completedTaskCount = await Task.countDocuments({
      ...assignedFilter,
      status: STATUS.INPROGRESS,
    });
    const now = new Date();

    const overDueTaskCount = await Task.countDocuments({
      ...assignedFilter,
      dueDate: { $lt: now },
      status: { $ne: STATUS.COMPLETED },
    });
    const allTaskCount = await Task.countDocuments(assignedFilter);

    return sendResponse(res, 200, "", {
      allTasks,
      inProgressTaskCount,
      allTaskCount,
      overDueTaskCount,
      completedTaskCount,
    });
  }
);
