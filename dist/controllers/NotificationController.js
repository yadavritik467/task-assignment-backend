import Notification from "../models/Notification.js";
import { catchAsync, sendResponse } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
export const AllNotification = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const unreadCount = await Notification.countDocuments({
        userId: req?.user?._id,
        isRead: false,
    });
    const notification = await Notification.find({ userId: req?.user?._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return sendResponse(res, 200, "", { notification, unreadCount });
});
export const MarkAllAsRead = catchAsync(async (req, res, next) => {
    const userId = req?.user?._id;
    let unreadNotifications = await Notification.find({
        userId,
        isRead: false,
    });
    if (!unreadNotifications.length) {
        return next(new AppError("All notifications are already read by you", 404));
    }
    await Promise.all(unreadNotifications.map(async (notification) => {
        if (!notification?.isRead) {
            notification.isRead = true;
            await notification.save();
        }
    }));
    return sendResponse(res, 200, "Marked all notification as read");
});
