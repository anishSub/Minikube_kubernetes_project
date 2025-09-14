// api/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
let server;

const userSocketMap = {}; // {userId: socketId} to store online users

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

if (process.env.NODE_ENV !== "production") {
  server = http.createServer(app); // Create HTTP server for Socket.IO in development
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  // Export io for use in other parts of the app (optional, if needed)
  export { io };
} else {
  server = app; // Use Express app without Socket.IO in production
}

export { app, server };
