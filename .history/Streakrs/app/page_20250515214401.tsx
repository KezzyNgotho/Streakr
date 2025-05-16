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
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md mx-auto px-4 py-3 flex-1">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1 pb-20">
          {activeTab === "home" && <HomePage />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
        </main>
      </div>
      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto w-full flex justify-around py-2">
        <button
          className={`flex flex-col items-center flex-1 py-1 ${activeTab === "home" ? "text-primary font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("home")}
        >
          <span className="material-icons text-lg mb-0.5">home</span>
          <span className="text-xs">Home</span>
        </button>
        <button
          className={`flex flex-col items-center flex-1 py-1 ${activeTab === "features" ? "text-primary font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("features")}
        >
          <span className="material-icons text-lg mb-0.5">star</span>
          <span className="text-xs">Features</span>
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

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-white">
          {avatar}
        </div>
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

      {/* Streak Summary */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-primary/80 mb-8">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-bold text-gray-900 flex-1">Your Streaks</h3>
          <span className="text-primary font-bold text-lg">{streaks.length}</span>
          <span className="ml-1 text-gray-700">active</span>
          <button className="ml-auto px-3 py-1 rounded bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow" onClick={() => setShowAdd(true)}>+ Add</button>
        </div>
        <div className="flex flex-col gap-2">
          {streaks.length === 0 && <div className="text-gray-500 text-sm">No streaks yet. Add a habit to get started!</div>}
          <AnimatePresence>
            {streaks.map((streak) => (
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

      {/* NFT Badge Preview */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-bold text-gray-900 flex-1">NFT Badges</h3>
          <a href="/gallery" className="text-primary text-xs font-semibold">View all</a>
        </div>
        <div className="flex gap-3">
          {/* Placeholder for NFT badges */}
          {minted.length === 0 && <div className="text-gray-500 text-sm">No NFTs yet. Complete a streak to mint your first badge!</div>}
          {minted.map((id, i) => (
            <motion.div key={id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs text-gray-900 font-semibold text-center">7-day streak</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
