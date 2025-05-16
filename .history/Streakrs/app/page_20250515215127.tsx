"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Home } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { useAvatar } from "./context/AvatarContext";
import { useStreaks } from "./context/StreakContext";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  const { avatar } = useAvatar();
  const { streaks } = useStreaks();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-tr from-primary/80 to-secondary/80 py-10 px-4 flex flex-col items-center justify-center shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-6xl shadow-xl border-4 border-white mb-2">{avatar}</div>
          <div className="text-3xl font-extrabold text-white drop-shadow">Welcome to Streakrs!</div>
          <div className="text-lg text-white/90 font-medium">Level {level} • {xp} XP</div>
          <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden mt-2">
            <motion.div className="h-full bg-gradient-to-r from-white to-secondary" animate={{ width: `${xpPercent}%` }} />
          </div>
          <div className="text-xs text-white/80 mt-1">{xpToNext} XP to next level</div>
          <div className="mt-4">
            <ConnectWallet />
          </div>
        </div>
        {/* Overlapping Stats Row */}
        <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 w-full max-w-2xl flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4">
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-primary">
              <span className="text-2xl font-bold text-primary">{streaks.length}</span>
              <span className="text-xs text-gray-500">Active Streaks</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-secondary">
              <span className="text-2xl font-bold text-secondary">{totalCompletions}</span>
              <span className="text-xs text-gray-500">Total Completions</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-orange-400">
              <span className="text-2xl font-bold text-orange-400">{currentStreak}</span>
              <span className="text-xs text-gray-500">Current Streak</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-green-600">
              <span className="text-2xl font-bold text-green-600">{bestStreak}</span>
              <span className="text-xs text-gray-500">Best Streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-32 pb-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Streaks */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <button className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition" onClick={() => setShowAdd(true)}>
              + Add Streak
            </button>
            {eligibleStreak ? (
              <button className="w-full px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold shadow hover:bg-orange-500 transition" onClick={() => handleMint(eligibleStreak.id)}>
                Claim NFT
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}
            <button className="w-full px-4 py-2 rounded-lg bg-secondary text-gray-900 font-semibold shadow hover:bg-secondary/80 transition" onClick={handleShare}>
              Share Progress
            </button>
          </div>
          {/* Active Streaks */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-primary/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">Your Streaks</h3>
              <span className="text-primary font-bold text-lg">{activeStreaks.length}</span>
              <span className="ml-1 text-gray-700">active</span>
              <button className="ml-auto px-3 py-1 rounded bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow" onClick={() => setShowAdd(true)}>+ Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {activeStreaks.length === 0 && <div className="text-gray-500 text-sm">No streaks yet. Add a habit to get started!</div>}
              <AnimatePresence>
                {activeStreaks.map((streak) => (
                  <motion.div key={streak.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 shadow border border-gray-100">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{streak.name}</div>
                      <div className="text-xs text-gray-600">{streak.frequency} • {streak.count} days</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow" onClick={() => completeStreak(streak.id)}>+1</button>
                      <button className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-semibold hover:bg-gray-200 transition shadow" onClick={() => resetStreak(streak.id)}>Reset</button>
                      {streak.completed && !minted.includes(streak.id) && (
                        <motion.button
                          className="px-2 py-1 rounded bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition shadow"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMint(streak.id)}
                        >
                          Mint NFT
                        </motion.button>
                      )}
                      {minted.includes(streak.id) && <span className="text-green-600 font-bold text-xs ml-2">NFT Minted!</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
          {/* Completed Streaks */}
          {completedStreaks.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-green-400/80">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-bold text-green-700 flex-1">Completed Streaks</h3>
                <span className="text-green-600 font-bold text-lg">{completedStreaks.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {completedStreaks.map((streak) => (
                  <div key={streak.id} className="bg-green-50 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 border border-green-100">
                    <div className="flex-1">
                      <div className="font-bold text-green-900">{streak.name}</div>
                      <div className="text-xs text-green-700">{streak.frequency} • {streak.count} days</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs ml-2">Completed!</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
        {/* Right Column: NFT Badges & Explore */}
        <div className="flex flex-col gap-6">
          {/* NFT Badge Preview */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">NFT Badges</h3>
              <a href="/gallery" className="text-primary text-xs font-semibold">View all</a>
            </div>
            <div className="flex gap-3 flex-wrap">
              {minted.length === 0 && <div className="text-gray-500 text-sm">No NFTs yet. Complete a streak to mint your first badge!</div>}
              {minted.map((id, i) => (
                <motion.div key={id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xs text-gray-900 font-semibold text-center">7-day streak</div>
                </motion.div>
              ))}
            </div>
          </motion.section>
          {/* Explore/Suggested Habits */}
          <section className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-blue-400/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-blue-700 flex-1">Explore Habits</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Drink Water', 'Read 10 pages', 'Meditate', 'Exercise', 'No Sugar', 'Sleep by 11pm'].map((habit) => (
                <span key={habit} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 cursor-pointer hover:bg-blue-100 transition">{habit}</span>
              ))}
            </div>
          </section>
        </div>
      </main>
      {/* Footer/Branding */}
      <footer className="w-full bg-gray-900 text-white py-6 mt-auto flex justify-center items-center shadow-inner">
        <a
          href="https://celo.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/70 hover:text-primary transition"
        >
          Built on Celo & MiniKit
        </a>
      </footer>
      {/* Add Streak Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 border border-gray-100" onSubmit={handleAdd}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">New Streak</h3>
              <input className="border rounded px-3 py-2 text-gray-900 bg-gray-50" name="name" placeholder="Streak name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <label htmlFor="frequency" className="sr-only">Frequency</label>
              <select id="frequency" className="border rounded px-3 py-2 text-gray-900 bg-gray-50" name="frequency" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition shadow">Create</button>
                <button type="button" className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition shadow" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage() {
  const { avatar } = useAvatar();
  const { streaks, addStreak, completeStreak, resetStreak } = useStreaks();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", frequency: "daily" });
  const [minted, setMinted] = useState<string[]>([]);

  // XP/level logic (simple demo)
  const totalCompletions = streaks.reduce((a, s) => a + s.count, 0);
  const level = 1 + Math.floor(totalCompletions / 7);
  const xp = totalCompletions * 10;
  const xpToNext = (level * 7 * 10) - xp;
  const xpPercent = Math.min(100, Math.round((xp / (level * 7 * 10)) * 100));

  // NFT mint logic (demo: mint if any streak is completed and not yet minted)
  const eligibleStreak = streaks.find(s => s.completed && !minted.includes(s.id));

  // Stats
  const currentStreak = streaks.reduce((max, s) => Math.max(max, s.count), 0);
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.count), 0);
  const completedStreaks = streaks.filter(s => s.completed);
  const activeStreaks = streaks.filter(s => !s.completed);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addStreak(form.name, form.frequency as "daily" | "weekly");
    setForm({ name: "", frequency: "daily" });
    setShowAdd(false);
  }
  function handleMint(streakId: string) {
    setMinted((prev) => [...prev, streakId]);
    // TODO: trigger confetti, call NFT mint contract
  }
  function handleShare() {
    // TODO: implement share/copy logic
    alert("Share feature coming soon!");
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-8 flex flex-col gap-6">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl shadow-xl p-5 mb-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-white">{avatar}</div>
        <div className="flex-1">
          <div className="text-xl font-bold text-gray-900">Welcome to Streakrs!</div>
          <div className="text-gray-600 text-sm mb-1">Level {level} • {xp} XP</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${xpPercent}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{xpToNext} XP to next level</div>
        </div>
        <div className="ml-auto">
          <ConnectWallet />
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-2">
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{streaks.length}</span>
          <span className="text-xs text-gray-500">Active Streaks</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-secondary">{totalCompletions}</span>
          <span className="text-xs text-gray-500">Total Completions</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-orange-400">{currentStreak}</span>
          <span className="text-xs text-gray-500">Current Streak</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-green-600">{bestStreak}</span>
          <span className="text-xs text-gray-500">Best Streak</span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
        <button className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition" onClick={() => setShowAdd(true)}>
          + Add Streak
        </button>
        {eligibleStreak ? (
          <button className="w-full px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold shadow hover:bg-orange-500 transition" onClick={() => handleMint(eligibleStreak.id)}>
            Claim NFT
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
        <button className="w-full px-4 py-2 rounded-lg bg-secondary text-gray-900 font-semibold shadow hover:bg-secondary/80 transition" onClick={handleShare}>
          Share Progress
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Streaks */}
        <div className="flex flex-col gap-6">
          {/* Active Streaks */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-primary/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">Your Streaks</h3>
              <span className="text-primary font-bold text-lg">{activeStreaks.length}</span>
              <span className="ml-1 text-gray-700">active</span>
              <button className="ml-auto px-3 py-1 rounded bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow" onClick={() => setShowAdd(true)}>+ Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {activeStreaks.length === 0 && <div className="text-gray-500 text-sm">No streaks yet. Add a habit to get started!</div>}
              <AnimatePresence>
                {activeStreaks.map((streak) => (
                  <motion.div key={streak.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 shadow border border-gray-100">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{streak.name}</div>
                      <div className="text-xs text-gray-600">{streak.frequency} • {streak.count} days</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow" onClick={() => completeStreak(streak.id)}>+1</button>
                      <button className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-semibold hover:bg-gray-200 transition shadow" onClick={() => resetStreak(streak.id)}>Reset</button>
                      {streak.completed && !minted.includes(streak.id) && (
                        <motion.button
                          className="px-2 py-1 rounded bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition shadow"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMint(streak.id)}
                        >
                          Mint NFT
                        </motion.button>
                      )}
                      {minted.includes(streak.id) && <span className="text-green-600 font-bold text-xs ml-2">NFT Minted!</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Completed Streaks */}
          {completedStreaks.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-green-400/80">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-bold text-green-700 flex-1">Completed Streaks</h3>
                <span className="text-green-600 font-bold text-lg">{completedStreaks.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {completedStreaks.map((streak) => (
                  <div key={streak.id} className="bg-green-50 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 border border-green-100">
                    <div className="flex-1">
                      <div className="font-bold text-green-900">{streak.name}</div>
                      <div className="text-xs text-green-700">{streak.frequency} • {streak.count} days</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs ml-2">Completed!</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column: NFT Badges & Explore */}
        <div className="flex flex-col gap-6">
          {/* NFT Badge Preview */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">NFT Badges</h3>
              <a href="/gallery" className="text-primary text-xs font-semibold">View all</a>
            </div>
            <div className="flex gap-3 flex-wrap">
              {minted.length === 0 && <div className="text-gray-500 text-sm">No NFTs yet. Complete a streak to mint your first badge!</div>}
              {minted.map((id, i) => (
                <motion.div key={id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xs text-gray-900 font-semibold text-center">7-day streak</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Explore/Suggested Habits */}
          <section className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-blue-400/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-blue-700 flex-1">Explore Habits</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Placeholder suggested habits */}
              {['Drink Water', 'Read 10 pages', 'Meditate', 'Exercise', 'No Sugar', 'Sleep by 11pm'].map((habit) => (
                <span key={habit} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 cursor-pointer hover:bg-blue-100 transition">{habit}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer/Branding */}
      <footer className="mt-2 pt-4 flex justify-center">
        <a
          href="https://celo.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-primary transition"
        >
          Built on Celo & MiniKit
        </a>
      </footer>

      {/* Add Streak Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 border border-gray-100" onSubmit={handleAdd}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">New Streak</h3>
              <input className="border rounded px-3 py-2 text-gray-900 bg-gray-50" name="name" placeholder="Streak name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <label htmlFor="frequency" className="sr-only">Frequency</label>
              <select id="frequency" className="border rounded px-3 py-2 text-gray-900 bg-gray-50" name="frequency" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition shadow">Create</button>
                <button type="button" className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition shadow" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
