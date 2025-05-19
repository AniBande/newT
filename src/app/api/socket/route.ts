import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

declare global {
  var io: SocketIOServer | undefined;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!global.io) {
    console.log('Initializing Socket.IO server...');

    try {
      const httpServer = new NetServer();

      console.log('Creating new Socket.IO server...');
      global.io = new SocketIOServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        transports: ['websocket', 'polling'],
        connectionStateRecovery: {
          maxDisconnectionDuration: 2000,
        },
      });

      global.io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join', (roomId: string) => {
          socket.join(roomId);
          console.log(`User ${socket.id} joined room ${roomId}`);
          socket.to(roomId).emit('new-peer');
        });

        socket.on('offer', (roomId: string, offer: RTCSessionDescriptionInit) => {
          console.log(`Offer received in room ${roomId}`);
          socket.to(roomId).emit('offer', offer);
        });

        socket.on('answer', (roomId: string, answer: RTCSessionDescriptionInit) => {
          console.log(`Answer received in room ${roomId}`);
          socket.to(roomId).emit('answer', answer);
        });

        socket.on('ice-candidate', (roomId: string, candidate: RTCIceCandidateInit) => {
          console.log(`ICE candidate received in room ${roomId}`);
          socket.to(roomId).emit('ice-candidate', candidate);
        });

        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      });

      // Start listening
      const port = parseInt(process.env.SOCKET_PORT || '3001', 10);
      httpServer.listen(port);
      console.log(`Socket.IO server is running on port ${port}!`);
    } catch (error) {
      console.error('Failed to initialize Socket.IO server:', error);
      return NextResponse.json({ error: 'Failed to initialize Socket.IO server' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'Socket.IO server running' }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export const POST = GET; 