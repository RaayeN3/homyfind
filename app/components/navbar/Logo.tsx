"use client";

import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div onClick={() => router.push("/")} className="cursor-pointer">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-800 transition">
        HomyFind
      </h1>
    </div>
  );
};

export default Logo;
