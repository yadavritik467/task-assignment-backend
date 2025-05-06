import jwt from "jsonwebtoken";
import { IUser } from "../models/User.js";

export const generateToken = (user: IUser) => {
  const token = jwt.sign(
    { _id: user._id, name: user?.name, role: user?.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  );

  return token;
};
