import { AppError } from "../utils/errorHandler.js";
const errorMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    res.status(statusCode).json({ success: false, message });
};
export default errorMiddleware;
