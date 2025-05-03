import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Roles } from "../enums/Role.enum.js";

export interface AuthRequest extends Request {
  user?: any;
}

const checkToken = (req: AuthRequest, res: Response) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.user = checkToken(req, res);
  next();
};

export const isAdmin =
  (allowedRoles: Roles[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = checkToken(req, res);

    if (allowedRoles?.includes(req.user?.role)) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "You don't have access for this action" });
    }
  };
