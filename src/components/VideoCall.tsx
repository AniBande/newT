import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const VideoCall = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const clientId = useRef<string>(uuidv4());
  const eventSource = useRef<EventSource | null>(null);

  // Start local video stream
  useEffect(() => {
    startLocalVideo();
    return () => stopLocalVideo();
  }, []);

  const startLocalVideo = async () => {
    try {
      if (!localStream.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        localStream.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access your camera. Please check permissions.');
    }
  };

  const stopLocalVideo = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // Handle room ID from URL
  useEffect(() => {
    const urlRoomId = searchParams?.get('room');
    if (urlRoomId) {
      setRoomId(urlRoomId);
      startCall(urlRoomId);
    }
  }, [searchParams]);

  const setupEventSource = (roomIdToUse: string) => {
    if (eventSource.current) {
      eventSource.current.close();
    }

    const url = `/api/signal?room=${roomIdToUse}&clientId=${clientId.current}`;
    eventSource.current = new EventSource(url);

    eventSource.current.onmessage = async (event) => {
      const { type, data } = JSON.parse(event.data);
      
      try {
        switch (type) {
          case 'new-peer':
            await handleNewPeer();
            break;
          case 'offer':
            await handleOffer(data);
            break;
          case 'answer':
            await handleAnswer(data);
            break;
          case 'ice-candidate':
            await handleIceCandidate(data);
            break;
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    eventSource.current.onerror = (error) => {
      console.error('EventSource error:', error);
      setError('Connection error. Please try again.');
      setIsConnecting(false);
    };
  };

  const sendSignal = async (type: string, data?: any) => {
    try {
      await fetch('/api/signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          roomId,
          clientId: clientId.current,
        }),
      });
    } catch (error) {
      console.error('Error sending signal:', error);
      throw error;
    }
  };

  const handleNewPeer = async () => {
    try {
      await setupPeerConnection();
      const offer = await peerConnection.current?.createOffer();
      if (offer) {
        await peerConnection.current?.setLocalDescription(offer);
        await sendSignal('offer', offer);
      }
    } catch (err) {
      console.error('Error handling new peer:', err);
      setError('Failed to connect with peer');
      setIsConnecting(false);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      await setupPeerConnection();
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current?.createAnswer();
      if (answer) {
        await peerConnection.current?.setLocalDescription(answer);
        await sendSignal('answer', answer);
      }
    } catch (err) {
      console.error('Error handling offer:', err);
      setError('Failed to handle offer');
      setIsConnecting(false);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Failed to handle answer');
      setIsConnecting(false);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnection.current?.remoteDescription) {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.error('Error handling ICE candidate:', err);
    }
  };

  const setupPeerConnection = async () => {
    if (!localStream.current) {
      await startLocalVideo();
    }

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection(configuration);

    // Add local tracks
    localStream.current?.getTracks().forEach(track => {
      if (localStream.current) {
        peerConnection.current?.addTrack(track, localStream.current);
      }
    });

    // Handle remote tracks
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal('ice-candidate', event.candidate);
      }
    };

    return peerConnection.current;
  };

  const startCall = async (targetRoomId?: string) => {
    try {
      setError('');
      setIsConnecting(true);
      const roomToUse = targetRoomId || roomId;
      
      await setupPeerConnection();
      setupEventSource(roomToUse);
      await sendSignal('new-peer');
      
      setIsCallActive(true);
      setIsConnecting(false);
      
      router.push(`/VideoCall?room=${roomToUse}`);
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Failed to start call. Please check your camera and microphone permissions.');
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (eventSource.current) {
      eventSource.current.close();
      eventSource.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    stopLocalVideo();
    setIsCallActive(false);
    setIsConnecting(false);
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

        <div className="space-y-4">
          {!isCallActive ? (
            <>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="w-full max-w-md px-4 py-2 border rounded-lg"
                  disabled={isConnecting}
                />
                <button
                  onClick={() => startCall()}
                  disabled={!roomId || isConnecting}
                  className="w-full max-w-md px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {isConnecting ? 'Connecting...' : 'Join Call'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    You
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 