"use client";

export default function StreaksPage() {
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