'use client';

import { useEffect, useRef, useState } from 'react';
import socket from '@/utils/socket';
import { useRouter, useSearchParams } from 'next/navigation';

const VideoCall = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Initialize WebRTC when component mounts
  useEffect(() => {
    const urlRoomId = searchParams?.get('room');
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }

    // Initialize socket connection
    socket.connect();

    return () => {
      cleanupCall();
      socket.disconnect();
    };
  }, []);

  // Handle socket events when roomId changes
  useEffect(() => {
    if (!roomId) return;

    const handleNewPeer = async () => {
      try {
        await setupPeerConnection();
        const offer = await peerConnection.current?.createOffer();
        if (offer) {
          await peerConnection.current?.setLocalDescription(offer);
          socket.emit('offer', roomId, offer);
        }
      } catch (err) {
        console.error('Error handling new peer:', err);
        setError('Failed to connect with peer');
      }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      try {
        await setupPeerConnection();
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current?.createAnswer();
        if (answer) {
          await peerConnection.current?.setLocalDescription(answer);
          socket.emit('answer', roomId, answer);
        }
      } catch (err) {
        console.error('Error handling offer:', err);
        setError('Failed to handle offer');
      }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      try {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error('Error handling answer:', err);
        setError('Failed to handle answer');
      }
    };

    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error handling ICE candidate:', err);
      }
    };

    socket.on('new-peer', handleNewPeer);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('new-peer', handleNewPeer);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [roomId]);

  const setupPeerConnection = async () => {
    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
    }

    // Create new RTCPeerConnection
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnection.current = new RTCPeerConnection(configuration);

    // Add local tracks to peer connection
    localStream.current.getTracks().forEach(track => {
      if (localStream.current) {
        peerConnection.current?.addTrack(track, localStream.current);
      }
    });

    // Handle incoming tracks
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', roomId, event.candidate);
      }
    };

    return peerConnection.current;
  };

  const startCall = async () => {
    try {
      setError('');
      await setupPeerConnection();
      socket.emit('join', roomId);
      setIsCallActive(true);
      
      // Update URL with room ID
      router.push(`/VideoCall?room=${roomId}`);
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Failed to start call. Please check your camera and microphone permissions.');
    }
  };

  const cleanupCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsCallActive(false);
  };

  const endCall = () => {
    cleanupCall();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Video Call</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isCallActive ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter a room ID to join or create"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Share this room ID with the person you want to call
              </p>
            </div>
            <button
              onClick={startCall}
              disabled={!roomId}
              className="w-full max-w-md px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  You
                </div>
              </div>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  Partner
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={endCall}
                className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall; 