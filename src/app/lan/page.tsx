"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/video-call?page&room=${roomId}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl mb-8">WebRTC Video Call</h1>
      <input
        className="mb-4 p-2 text-black rounded"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className="bg-blue-600 px-4 py-2 rounded"
        onClick={handleJoinRoom}
      >
        Join Room
      </button>
    </main>
  );
}
