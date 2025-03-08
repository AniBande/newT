'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 to-pink-600 text-white">
      <h1 className="text-4xl font-bold mb-10">Choose Your Experience</h1>
      <div className="space-y-6">
        <button
          className="px-6 py-3 bg-pink-500 text-lg font-semibold rounded-full shadow-lg hover:bg-pink-700 transition"
          onClick={() => router.push('/landing')}
        >
          Experience One
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
          onClick={() => router.push('/page1')}
        >
          Experience Two
        </button>
        <button
          className="px-6 py-3 bg-red-500 text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 transition"
          onClick={() => router.push('/page2')}
        >
          Experience Three
        </button>
      </div>
    </div>
  );
}
