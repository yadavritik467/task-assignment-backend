import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { initSocket } from "./utils/socket.js";
import userRoutes from "./routes/User.js"
import tasksRoutes from "./routes/Tasks.js"

dotenv.config();
const app = express();
const server = http.createServer(app);

// Start Server
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL as string,
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  })
);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/v1", tasksRoutes);
app.use("/api/v1", userRoutes);
initSocket(server);
app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("hiii");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
