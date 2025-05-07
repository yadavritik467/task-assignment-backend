import jwt from "jsonwebtoken";
const checkToken = (req, res) => {
    const token = req.header("Authorization");
    if (!token)
        return res.status(401).json({ message: "No token, authorization denied" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
export const authMiddleware = (req, res, next) => {
    req.user = checkToken(req, res);
    next();
};
export const checkRoles = (allowedRoles) => (req, res, next) => {
    req.user = checkToken(req, res);
    if (allowedRoles?.includes(req.user?.role)) {
        next();
    }
    else {
        return res
            .status(401)
            .json({ message: "You don't have access for this action" });
    }
};
