"use client";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-5xl mb-3 shadow-lg border-4 border-white">🦸‍♀️</div>
        <div className="text-2xl font-bold text-dark">laura.eth</div>
        <div className="text-light text-sm mt-1">Level 5 • 320 XP</div>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `64%` }} />
        </div>
        <div className="text-xs text-light mt-1">180 XP to next level</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center gap-2 border-t-4 border-primary/80">
          <div className="text-3xl font-bold text-primary mb-1">3</div>
          <div className="text-dark font-semibold">Active Streaks</div>
          <div className="text-xs text-light mt-1">Longest streak: <span className="font-bold text-secondary">14 days</span></div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
          <div className="flex items-center mb-1">
            <h3 className="text-lg font-bold text-dark flex-1">Achievements</h3>
            <button className="text-primary text-xs font-semibold">See all</button>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {/* Achievements will go here */}
            <div className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs text-dark font-semibold text-center">7-day streak</div>
            </div>
            <div className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs text-dark font-semibold text-center">Top 10</div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center gap-2 border-t-4 border-blue-400/80 md:col-span-2">
          <div className="flex gap-8 justify-center w-full">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-primary">5</span>
              <span className="text-xs text-light">Level</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-secondary">320</span>
              <span className="text-xs text-light">XP</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-green-500">14</span>
              <span className="text-xs text-light">Longest Streak</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 