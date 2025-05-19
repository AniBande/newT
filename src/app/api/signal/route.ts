import { NextRequest, NextResponse } from 'next/server';

// Store active connections and their messages
const rooms = new Map<string, Set<string>>();
const messages = new Map<string, any[]>();
const connections = new Map<string, ReadableStreamController<any>>();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { roomId, type, data, clientId } = await req.json();

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
      messages.set(roomId, []);
    }

    rooms.get(roomId)?.add(clientId);
    messages.get(roomId)?.push({ type, data, clientId });

    // Notify all clients in the room
    const roomConnections = Array.from(connections.entries())
      .filter(([id]) => rooms.get(roomId)?.has(id));

    roomConnections.forEach(([id, controller]) => {
      if (id !== clientId) {
        controller.enqueue({
          type,
          data,
          clientId
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signal error:', error);
    return NextResponse.json({ error: 'Failed to process signal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const roomId = searchParams.get('room');
  const clientId = searchParams.get('clientId');

  if (!roomId || !clientId) {
    return NextResponse.json({ error: 'Missing room ID or client ID' }, { status: 400 });
  }

  // Set up SSE stream
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Store the controller for this client
  connections.set(clientId, {
    enqueue: async (data: any) => {
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      } catch (error) {
        console.error('Write error:', error);
      }
    }
  } as any);

  // Clean up on disconnect
  req.signal.addEventListener('abort', () => {
    connections.delete(clientId);
    rooms.forEach((clients) => clients.delete(clientId));
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 