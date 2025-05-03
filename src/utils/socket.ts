import { Server } from "socket.io";
import http from "http";

let io: Server;
const userSocketMap = new Map<string, string>();

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      const key = `${userId}_${role}`;
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
