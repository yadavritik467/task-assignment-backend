import jwt from "jsonwebtoken";
export const generateToken = (user) => {
    const token = jwt.sign({ _id: user._id, name: user?.name, role: user?.role }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    return token;
};
