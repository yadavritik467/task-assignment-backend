import { Server } from "socket.io";
import http from "http";

let io: Server;
const userSocketMap = new Map<string, string>();

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONT_URL as string,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", ({ userId }) => {
      const key = `${userId}`;
      userSocketMap.set(key, socket.id);

      console.log("register ", userSocketMap);
    });

    socket.on("disconnect", () => {
      userSocketMap.forEach((id, key) => {
        if (id === socket.id) {
          userSocketMap.delete(key);
        }
      });
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return { io, userSocketMap };
};
