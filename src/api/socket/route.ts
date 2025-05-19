import { Server } from "socket.io";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextRequest) => {
  if (!(global as any).io) {
    const io = new Server({
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("new-peer");
      });

      socket.on("offer", (roomId: string, offer: RTCSessionDescriptionInit) => {
        console.log(`Offer received in room ${roomId}`);
        socket.to(roomId).emit("offer", offer);
      });

      socket.on("answer", (roomId: string, answer: RTCSessionDescriptionInit) => {
        console.log(`Answer received in room ${roomId}`);
        socket.to(roomId).emit("answer", answer);
      });

      socket.on("ice-candidate", (roomId: string, candidate: RTCIceCandidateInit) => {
        console.log(`ICE candidate received in room ${roomId}`);
        socket.to(roomId).emit("ice-candidate", candidate);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    (global as any).io = io;
    console.log("Socket.IO server started!");
  }
};

export const GET = ioHandler;
export const POST = ioHandler;
