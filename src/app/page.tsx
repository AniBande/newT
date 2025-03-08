import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-5xl font-bold mb-6 text-pink-400 animate-pulse">
        Hii Sandhya ❤️
      </h1>
      <p className="text-lg text-gray-300 italic">
        "uuuuuuuuummmmmmmhhhhhhhhaaaaaaaaaa"
      </p>
      
      <div className="mt-10 flex space-x-4">
        <a
          href="/Twilight.pdf"
          download
          className="px-6 py-3 bg-pink-600 text-white text-lg rounded-full shadow-lg hover:bg-pink-700 transition"
        >
          The Love Letter 💌
        </a>
        <a
          href="/ahoo"
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Go Ahead and Enjoy🌟
        </a>
      </div>
    </div>
  );
}