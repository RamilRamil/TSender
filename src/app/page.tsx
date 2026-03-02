"use client";

import { useAccount } from "wagmi";
import HomeContent from "../components/HomeContent";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div>
      {!isConnected ? (
        <div>
          <h1 className="text-2xl font-bold text-center">Connect your wallet to continue</h1>
        </div>
      ) : (
        <HomeContent />
      )}
    </div>
  );
}
