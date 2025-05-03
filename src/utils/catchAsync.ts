import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const catchAsync =
  (
    passedFunc: (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      console.error("Caught in catchAsync:", error);
      if (error instanceof Error) {
        next(error);
      } else {
        const normalizedError = new Error("Unknown error occurred");
        (normalizedError as any).original = error; 
        next(normalizedError);
      }
      next(error);
    }
  };

export default catchAsync;
