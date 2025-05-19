"use client";

import dynamic from 'next/dynamic';

// Dynamically import the VideoCall component with no SSR
const VideoCallComponent = dynamic(
  () => import('../../components/VideoCall'),
  { ssr: false }
);

export default function VideoCallPage() {
  return <VideoCallComponent />;
}
