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
      <div className="w-full max-w-7xl mx-auto flex-1">
        <main className="flex-1">
          {activeTab === "home" && <HomePage />}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "gallery" && <GalleryPage />}
        </main>
      </div>
      {/* Floating Bottom Tab Bar with animation and badge */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-xs w-[95vw] flex justify-around py-2 px-2 transition-all">
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all ${activeTab === "home" ? "text-primary font-bold scale-110" : "text-gray-500 hover:text-primary/80"}`}
          onClick={() => setActiveTab("home")}
        >
          <span className="material-icons text-lg mb-0.5">home</span>
          <span className="text-xs">Home</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 transition-all ${activeTab === "gallery" ? "text-orange-500 font-bold scale-110" : "text-gray-500 hover:text-orange-400/80"}`}
          onClick={() => setActiveTab("gallery")}
        >
          <span className="material-icons text-lg mb-0.5">collections</span>
          <span className="text-xs">Gallery</span>
        </button>
        <button
          className={`relative flex flex-col items-center flex-1 py-1 transition-all ${activeTab === "profile" ? "text-blue-600 font-bold scale-110" : "text-gray-500 hover:text-blue-600/80"}`}
          onClick={() => setActiveTab("profile")}
        >
          <span className="material-icons text-lg mb-0.5">person</span>
          <span className="text-xs">Profile</span>
          {/* Notification badge (stub: always show for demo) */}
          <span className="absolute top-1 left-6 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      </nav>
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
    <>
      {/* Compact Welcome/Profile Card */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-lg px-5 py-3 max-w-xl w-full">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow border-2 border-white">{avatar}</div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900">Welcome to <span className="text-primary">Streakrs!</span></div>
            <div className="text-xs text-gray-900 mb-1">Level {level} • {xp} XP</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${xpPercent}%` }} />
            </div>
            <div className="text-xs text-gray-700 mt-1">{xpToNext} XP to next level</div>
          </div>
          <div className="ml-2">
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-2 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{streaks.length}</span>
          <span className="text-xs text-gray-900">Active</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-secondary">{totalCompletions}</span>
          <span className="text-xs text-gray-900">Completions</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-orange-400">{currentStreak}</span>
          <span className="text-xs text-gray-900">Current</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-green-600">{bestStreak}</span>
          <span className="text-xs text-gray-900">Best</span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 max-w-2xl mx-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left Column: Streaks */}
        <div className="flex flex-col gap-6">
          {/* Active Streaks */}
          <section className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-primary/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">Your Streaks</h3>
              <span className="text-primary font-bold text-lg">{activeStreaks.length}</span>
              <span className="ml-1 text-gray-900">active</span>
              <button className="ml-auto px-3 py-1 rounded bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow" onClick={() => setShowAdd(true)}>+ Add</button>
            </div>
            <div className="flex flex-col gap-2">
              {activeStreaks.length === 0 && <div className="text-gray-700 text-sm">No streaks yet. Add a habit to get started!</div>}
              <AnimatePresence>
                {activeStreaks.map((streak) => (
                  <motion.div key={streak.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 shadow border border-gray-100">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{streak.name}</div>
                      <div className="text-xs text-gray-700">{streak.frequency} • {streak.count} days</div>
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
          </section>
          {/* Completed Streaks */}
          {completedStreaks.length > 0 && (
            <section className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-green-400/80">
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
            </section>
          )}
        </div>
        {/* Right Column: NFT Badges & Explore */}
        <div className="flex flex-col gap-6">
          {/* NFT Badge Preview */}
          <section className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-bold text-gray-900 flex-1">NFT Badges</h3>
              <a href="/gallery" className="text-primary text-xs font-semibold">View all</a>
            </div>
            <div className="flex gap-3 flex-wrap">
              {minted.length === 0 && <div className="text-gray-700 text-sm">No NFTs yet. Complete a streak to mint your first badge!</div>}
              {minted.map((id, i) => (
                <motion.div key={id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xs text-gray-900 font-semibold text-center">7-day streak</div>
                </motion.div>
              ))}
            </div>
          </section>
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
      </div>

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
    </>
  );
}

function ProfilePage() {
  const { avatar, setAvatar } = useAvatar();
  const { streaks } = useStreaks();
  const address = undefined; // Placeholder, not connected
  const totalCompletions = streaks.reduce((a, s) => a + s.count, 0);
  const level = 1 + Math.floor(totalCompletions / 7);
  const xp = totalCompletions * 10;
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.count), 0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const avatarChoices = ["🦸‍♂️", "🦸‍♀️", "🧙‍♂️", "🧑‍🚀", "🧑‍🎤", "🧑‍💻", "🦄", "🐉", "🐼", "🐧", "🐸", "🦊", "🐵", "🐯", "🦁", "🐻", "🐨", "🐰", "🐶", "🐱"];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative w-full max-w-xs bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-xl p-6 flex flex-col items-center mb-6">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-primary transition">
          <span className="material-icons text-2xl">settings</span>
        </button>
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow border-2 border-white mb-2">{avatar}</div>
        <div className="text-lg font-bold text-gray-900 mb-1">Your Profile</div>
        <div className="text-xs text-gray-700 mb-2">Level {level} • {xp} XP</div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.min(100, Math.round((xp / (level * 7 * 10)) * 100))}%` }} />
        </div>
        <div className="text-xs text-gray-500 mb-2 truncate">{address ? address : 'Not connected'}</div>
        <button className="mt-2 px-4 py-1 rounded bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow" onClick={() => setShowAvatarModal(true)}>Change Avatar</button>
      </div>
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-4 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Your Avatar</h3>
              <div className="grid grid-cols-5 gap-2">
                {avatarChoices.map((a) => (
                  <button key={a} className="text-2xl p-2 rounded-full hover:bg-primary/10 transition" onClick={() => { setAvatar(a); setShowAvatarModal(false); }} aria-label={`Choose avatar ${a}`}>{a}</button>
                ))}
              </div>
              <button className="mt-2 px-4 py-2 rounded bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition shadow" onClick={() => setShowAvatarModal(false)}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{streaks.length}</span>
          <span className="text-xs text-gray-900">Active</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-secondary">{totalCompletions}</span>
          <span className="text-xs text-gray-900">Completions</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-green-600">{bestStreak}</span>
          <span className="text-xs text-gray-900">Best Streak</span>
        </div>
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
          <span className="text-lg font-bold text-orange-400">{level}</span>
          <span className="text-xs text-gray-900">Level</span>
        </div>
      </div>
      <p className="text-gray-700">More profile features coming soon!</p>
    </div>
  );
}

function GalleryPage() {
  const { streaks } = useStreaks();
  // For demo, show all completed streaks as NFT badges
  const minted = streaks.filter(s => s.completed);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-bold mb-4">NFT Gallery</h2>
      {minted.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="material-icons text-5xl text-orange-400 mb-2">collections</span>
          <p className="text-gray-700">No NFT badges yet. Complete a streak to mint your first badge!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md mx-auto">
          {minted.map((streak) => (
            <div key={streak.id} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-4 border border-gray-100 hover:scale-105 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-xs text-gray-900 font-semibold text-center mb-1">{streak.name}</div>
              <div className="text-xs text-gray-700">7-day streak</div>
              <a href={`https://celoscan.io/tx/0x123`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary mt-1 hover:underline">View on Celo Explorer</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
