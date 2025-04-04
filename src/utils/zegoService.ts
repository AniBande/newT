import { ZegoExpressEngine } from "zego-express-engine-webrtc";

let zg: ZegoExpressEngine | null = null;
let localStream: MediaStream | null = null;

interface LoginRoomParams {
  appID: number;
  serverSecret: string;
  roomID: string;
  userID: string;
  userName: string;
}

/**
 * Initialize ZegoExpressEngine
 */
export const initZego = async (appID: number): Promise<ZegoExpressEngine> => {
  if (!zg) {
    zg = new ZegoExpressEngine(appID, "wss://webliveroom-test.zegocloud.com/ws"); 
  }
  return zg;
};


/**
 * Login to the ZegoCloud Room and get the local stream
 */
export const loginRoom = async ({
  appID,
  serverSecret,
  roomID,
  userID,
  userName,
}: LoginRoomParams): Promise<MediaStream> => {
  if (!zg) {
    zg = await initZego(appID);
  }
  
  const token = generateToken(appID, serverSecret, roomID, userID);
  await zg.loginRoom(roomID, token, { userID, userName }, { userUpdate: true });
  
  localStream = await zg.createStream({
    camera: { video: true, audio: true },
  });
  
  return localStream;
};

/**
 * Start Publishing Local Stream
 */
export const startPublishing = async (streamID: string): Promise<void> => {
  if (!zg) {
    throw new Error("ZegoEngine is not initialized");
  }
  if (!localStream) {
    throw new Error("localStream is not initialized");
  }
  
  await zg.startPublishingStream(streamID, localStream);
};

/**
 * Play Remote Stream
 */
export const playRemoteStream = (
  onRemoteStreamReceived: (stream: MediaStream) => void
): void => {
  if (!zg) {
    throw new Error("ZegoEngine is not initialized");
  }
  
  const zegoInstance = zg; // Create a local constant that TypeScript knows cannot be null
  
  zegoInstance.on("roomStreamUpdate", async (_roomID, updateType, streamList) => {
    if (updateType === "ADD" && streamList.length > 0) {
      const remoteStream = await zegoInstance.startPlayingStream(streamList[0].streamID);
      onRemoteStreamReceived(remoteStream);
    }
  });
};

/**
 * Stop publishing and clean up resources
 */
export const stopPublishingAndLeave = async (streamID: string | null = null): Promise<void> => {
  if (!zg) {
    return;
  }
  
  // Stop publishing if streamID is provided
  if (streamID && localStream) {
    zg.stopPublishingStream(streamID);
  }
  
  // Stop the local stream
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  
  // Logout from room
  await zg.logoutRoom();
};

/**
 * Generate Test Token (DO NOT USE IN PRODUCTION)
 */
const generateToken = (
  appID: number,
  serverSecret: string,
  roomID: string,
  userID: string
): string => {
  const expiration = Math.floor(Date.now() / 1000) + 3600;
  return btoa(`${appID}:${roomID}:${userID}:${expiration}:${serverSecret}`);
};