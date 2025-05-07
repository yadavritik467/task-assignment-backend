export const catchAsync = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next);
    }
    catch (error) {
        console.error("Caught in catchAsync:", error);
        if (error instanceof Error) {
            next(error);
        }
        else {
            const normalizedError = new Error("Unknown error occurred");
            normalizedError.original = error;
            next(normalizedError);
        }
        next(error);
    }
};
export const sendResponse = (res, status, message, data) => {
    return res.status(status).json({ message, data });
};
