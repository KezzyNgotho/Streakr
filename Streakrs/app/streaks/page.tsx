"use client";
import { useState } from "react";

export default function StreaksPage() {
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [minted, setMinted] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [minting, setMinting] = useState(false);

  function handleCheckIn() {
    setCheckingIn(true);
    // TODO: Replace with contract call to checkIn()
    setTimeout(() => {
      setStreak((s) => s + 1);
      setLastCheckIn(new Date());
      setCheckingIn(false);
    }, 1000);
  }

  function handleMint() {
    setMinting(true);
    // TODO: Replace with contract call to mintIfStreak(minStreak, uri)
    setTimeout(() => {
      setMinted(true);
      setMinting(false);
    }, 1500);
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="text-2xl font-bold text-dark">Your Streaks</div>
          <div className="text-light text-sm">Track, complete, and level up your habits!</div>
        </div>
        <button
          className="hidden md:inline px-4 py-2 rounded bg-gradient-to-tr from-primary to-secondary text-white font-semibold hover:scale-105 transition"
        >
          + New Streak
        </button>
      </div>
      <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-100 flex flex-col items-center">
        <div className="text-lg font-semibold text-dark">Current Streak: {streak} days</div>
        <div className="text-light text-sm mb-2">
          Last check-in: {lastCheckIn ? lastCheckIn.toLocaleString() : "Never"}
        </div>
        <button
          className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition mb-2"
          onClick={handleCheckIn}
          disabled={checkingIn}
        >
          {checkingIn ? "Checking in..." : "Check In"}
        </button>
        <button
          className="px-4 py-2 rounded bg-accent text-white font-semibold hover:bg-accent/90 transition"
          onClick={handleMint}
          disabled={minting || streak < 3 || minted}
        >
          {minting ? "Minting..." : minted ? "NFT Minted!" : "Mint NFT (3+ streak)"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak cards will go here */}
        <div className="col-span-2 text-center text-light py-12">No streaks yet. Start one!</div>
      </div>
      <button
        className="md:hidden fixed bottom-20 right-6 z-50 bg-gradient-to-tr from-primary to-secondary text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl font-bold hover:scale-110 transition"
        aria-label="Add new streak"
      >
        +
      </button>
    </div>
  );
} 