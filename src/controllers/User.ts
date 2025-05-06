import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { ROLES } from "../enums/enum.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
import { generateToken } from "../utils/utils.js";

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

    if (!name) return next(new AppError("Name is required", 400));
    if (!email) return next(new AppError("Email is required", 400));
    if (!password) return next(new AppError("Password is required", 400));

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

export const adminLogin = catchAsync(
  async (
    req: Request<{}, {}, userReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { email, password } = req.body;

    if (!email) return next(new AppError("Email is required", 400));
    if (!password) return next(new AppError("Password is required", 400));
    email = email?.toLowerCase();

    const isExistsAdmin = await User.findOne({ email });
    if (!isExistsAdmin) {
      const admin = await User.create({
        email,
        password,
        role: ROLES.ADMIN,
      });

      const token = generateToken(admin);
      return sendResponse(res, 200, "Login successfully", token);
    } else {
      // Check password
      const isMatch = await bcrypt.compare(password, isExistsAdmin.password);
      if (!isMatch) return next(new AppError("Invalid credential", 400));
      const token = generateToken(isExistsAdmin);
      return sendResponse(res, 200, "Login successfully", token);
    }
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, userReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    let { email, password } = req.body;

    if (!email) return next(new AppError("Email is required", 400));
    if (!password) return next(new AppError("Password is required", 400));
    email = email?.toLowerCase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("Account does not exist", 404));

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid credential", 400));

    // Generate JWT
    const token = generateToken(user);

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
      const userObj = u.toObject();
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
