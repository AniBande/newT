"use client";

import React from "react";

interface ControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) => {
  return (
    <div className="flex space-x-4">
      <button
        className="bg-gray-700 px-4 py-2 rounded"
        onClick={onToggleMute}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <button
        className="bg-gray-700 px-4 py-2 rounded"
        onClick={onToggleCamera}
      >
        {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </button>
      <button
        className="bg-red-600 px-4 py-2 rounded"
        onClick={onEndCall}
      >
        End Call
      </button>
    </div>
  );
};

export default Controls;
