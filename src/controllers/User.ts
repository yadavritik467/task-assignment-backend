import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

interface userReqBody {
  name?: string;
  email: string;
  password: string;
}
export const signup = catchAsync(
  async (
    req: Request<{}, {}, userReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { name, email, password } = req.body;
    email = email?.toLowerCase();
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return next(new AppError("User already exists", 400));

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save User
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    return sendResponse(res, 201, "User registered successfully");
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, userReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { email, password } = req.body;
    email = email?.toLowerCase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Invalid credential", 400));

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid credential", 400));

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, name: user?.name, role: user?.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    return sendResponse(res, 200, "Login successfully", token);
  }
);

export const myProfile = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    return sendResponse(res, 200, "", user);
  }
);

export const getAllUsers = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const search = req?.query?.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const allUsers = await User.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const plainUsers = allUsers.map((u) => {
      const userObj = u.toObject(); // Convert Mongoose document to plain object
      return {
        ...userObj,
        qrCodes: Array.isArray(userObj.qrCodes) ? userObj.qrCodes.length : 0,
      };
    });
    return sendResponse(res, 200, "Login successfully", {
      allUsers: plainUsers,
    });
  }
);
