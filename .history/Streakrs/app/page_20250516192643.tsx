"use client";

import {
  useMiniKit,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  ConnectWallet,
} from "@coinbase/onchainkit/wallet";
import { useEffect,  useState, useRef } from "react";
//import { Button } from "./components/DemoComponents";
//import { Icon } from "./components/DemoComponents";
import { useAvatar } from "./context/AvatarContext";
import { useStreaks } from "./context/StreakContext";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "./components/BottomNav";

// Sidebar nav items config
const SIDEBAR_NAV = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "explore", icon: "🔎", label: "Explore" },
  { key: "gallery", icon: "🖼️", label: "Collectibles" },
  { key: "leaderboard", icon: "🏆", label: "Leaderboard" },
  { key: "friends", icon: "👥", label: "Friends" },
  { key: "stats", icon: "📈", label: "Stats" }
];
const SIDEBAR_BOTTOM = [
  { key: "settings", icon: "⚙️", label: "Settings", isSettings: true },
];

function Sidebar({ expanded, setExpanded, activeTab, setActiveTab, notificationCount, avatar, darkMode, setDarkMode }: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  notificationCount: number;
  avatar: string;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  // Keyboard navigation
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  function handleKeyDown(e: React.KeyboardEvent, idx: number, navList: { key: string; icon: string; label: string; isSettings?: boolean; }[]) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navRefs.current[(idx + 1) % navList.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navRefs.current[(idx - 1 + navList.length) % navList.length]?.focus();
    }
  }
  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300
        ${expanded ? "w-40" : "w-16"}
        bg-gradient-to-b from-white/90 to-gray-100/80 dark:from-gray-900/95 dark:to-gray-800/90 border-r border-gray-200/60 flex flex-col
        items-center py-3 px-2 overflow-hidden
        backdrop-blur-xl`}
      style={{ transitionProperty: 'width,background-color' }}
      aria-label="Sidebar navigation"
    >
      {/* Logo & expand/collapse */}
      <div className="flex items-center w-full mb-8 select-none">
        <span className="text-3xl font-extrabold text-primary tracking-tight mr-2">🔥</span>
        {expanded && <span className="text-lg font-bold text-gray-900 dark:text-white">Streakrs</span>}
        <button
          className="ml-auto p-1 rounded hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-xl" role="img" aria-label={expanded ? "Collapse" : "Expand"}>{expanded ? "⬅️" : "➡️"}</span>
        </button>
      </div>
      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 w-full items-center" role="navigation">
        {SIDEBAR_NAV.map((tab, i) => (
          <button
            key={tab.key}
            ref={el => { navRefs.current[i] = el; }}
            aria-label={tab.label}
            className={`group relative flex items-center w-12 ${expanded ? "md:w-[90%]" : "w-12"} py-2 my-0.5 rounded-xl focus:outline-none transition-all
              ${activeTab === tab.key ? "bg-primary/20 text-primary font-bold" : "text-gray-500 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20"}
              hover:scale-[1.04] active:scale-95`}
            onClick={() => setActiveTab(tab.key)}
            tabIndex={0}
            onKeyDown={e => handleKeyDown(e, i, SIDEBAR_NAV)}
          >
            {/* Animated active pill */}
            <span className={`absolute left-1 top-2 bottom-2 w-1 rounded-full transition-all duration-300 ${activeTab === tab.key ? "bg-primary bg-opacity-80" : "bg-transparent"}`} />
            <span className="text-2xl mx-auto transition-all">{tab.icon}</span>
            {expanded && <span className="ml-2 text-sm font-medium transition-all">{tab.label}</span>}
            {/* Tooltip for minimized */}
            {!expanded && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">{tab.label}</span>
            )}
            {/* Notification badge for Home (or whichever you want) */}
            {tab.key === "home" && notificationCount > 0 && (
              <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
            )}
          </button>
        ))}
        {/* Divider */}
        <div className="w-10 md:w-[80%] h-px bg-primary/20 my-4 mx-auto" />
        {/* Bottom nav */}
        {SIDEBAR_BOTTOM.map((tab, i) => (
          <button
            key={tab.key}
            ref={el => { navRefs.current[SIDEBAR_NAV.length + i] = el; }}
            aria-label={tab.label}
            className={`group relative flex items-center w-12 ${expanded ? "md:w-[90%]" : "w-12"} py-2 my-0.5 rounded-xl focus:outline-none transition-all
              ${activeTab === tab.key ? "bg-gray-900/10 text-gray-900 dark:bg-primary/20 dark:text-primary font-bold" : "text-gray-500 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-primary/20"}
              hover:scale-[1.04] active:scale-95`}
            onClick={() => setActiveTab(tab.key)}
            tabIndex={0}
            onKeyDown={e => handleKeyDown(e, SIDEBAR_NAV.length + i, SIDEBAR_NAV.concat(SIDEBAR_BOTTOM))}
          >
            <span className={`absolute left-1 top-2 bottom-2 w-1 rounded-full transition-all duration-300 ${activeTab === tab.key ? "bg-gray-900 dark:bg-primary bg-opacity-80" : "bg-transparent"}`} />
            <span className={`text-2xl mx-auto transition-all ${tab.isSettings ? "group-hover:animate-spin" : ""}`}>{tab.icon}</span>
            {expanded && <span className="ml-2 text-sm font-medium transition-all">{tab.label}</span>}
            {!expanded && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">{tab.label}</span>
            )}
          </button>
        ))}
      </nav>
      {/* Dark mode toggle & user avatar at bottom */}
      <div className="flex flex-col items-center gap-4 w-full mt-8 mb-2">
        <button
          className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-semibold hover:bg-primary/20 dark:hover:bg-primary/30 transition"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          <span className="text-xl" role="img" aria-label="Theme">{darkMode ? "🌙" : "☀️"}</span>
          {expanded && <span className="text-xs font-medium">{darkMode ? "Dark" : "Light"} Mode</span>}
        </button>
        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl border-2 border-primary/40 dark:border-primary/60 shadow-sm">
          {avatar}
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const { setFrameReady, isFrameReady} = useMiniKit();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { avatar } = useAvatar();
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Dark mode body class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Onboarding: show only for first-time users
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('streakrs_onboarding_seen');
      if (!seen) setShowOnboarding(true);
    }
  }, []);
  function handleCloseOnboarding() {
    setShowOnboarding(false);
    localStorage.setItem('streakrs_onboarding_seen', '1');
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-white to-pink-50 flex">
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-4 border border-gray-100 dark:border-gray-800 text-center">
              <span className="text-4xl mb-2">🔥</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welcome to Streakrs!</h2>
              <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">Track habits, earn NFT badges, and level up your life. Connect your wallet to get started!</p>
              <ul className="text-left text-xs text-gray-600 dark:text-gray-300 mb-2 flex flex-col gap-1">
                <li><span className="text-primary font-bold">•</span> Add your first streak (habit) from the Home page</li>
                <li><span className="text-primary font-bold">•</span> Complete streaks to earn XP and NFT badges</li>
                <li><span className="text-primary font-bold">•</span> Connect your wallet to mint badges on Celo</li>
                <li><span className="text-primary font-bold">•</span> Explore, compete, and share your progress!</li>
              </ul>
              <button onClick={handleCloseOnboarding} className="mt-2 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition shadow focus:outline-none focus:ring-2 focus:ring-primary">Get Started</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar: only show on md+ screens */}
      <div className="hidden md:block md:mr-4">
        <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={0} avatar={avatar} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <div className={`flex-1 transition-all duration-300 md:ml-16 md:ml-40 w-full ${darkMode ? "bg-gray-900 text-white" : ""} pt-14 pb-16 md:pb-0`}> 
        <main className="flex-1 px-2 sm:px-4 pb-16 md:pb-0 max-w-screen-sm mx-auto">
          {activeTab === "home" && <HomePage />}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "gallery" && <GalleryPage />}
          {activeTab === "explore" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <span className="material-icons text-5xl text-green-600 mb-2">explore</span>
              <h2 className="text-2xl font-bold mb-2">Explore</h2>
              <div className="mb-4 text-gray-700">Discover new habits and trending streaks!</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md mx-auto">
                {['Drink Water', 'Read 10 pages', 'Meditate', 'Exercise', 'No Sugar', 'Sleep by 11pm', 'Journaling', 'Stretch', 'Walk 5k steps'].map((habit) => (
                  <div key={habit} className="bg-primary/10 rounded-xl px-4 py-3 flex flex-col items-center shadow hover:scale-105 hover:bg-primary/20 transition cursor-pointer">
                    <span className="text-2xl mb-1">✨</span>
                    <span className="text-sm font-semibold text-gray-900">{habit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 w-full max-w-md mx-auto">
                <div className="text-lg font-bold text-gray-900 mb-2">Trending Streaks</div>
                <div className="flex flex-col gap-2">
                  {[{ name: 'No Sugar', count: 21 }, { name: 'Read 10 pages', count: 14 }, { name: 'Walk 5k steps', count: 30 }].map((streak) => (
                    <div key={streak.name} className="bg-white rounded-xl shadow p-3 flex items-center gap-3">
                      <span className="text-xl">🔥</span>
                      <span className="font-semibold text-gray-900 flex-1">{streak.name}</span>
                      <span className="text-xs text-gray-700">{streak.count} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "leaderboard" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <span className="material-icons text-5xl text-purple-600 mb-2">emoji_events</span>
              <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
              <div className="mb-4 text-gray-700">See top streakers and rankings!</div>
              <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                  {[{ name: 'Alice', avatar: '🦸‍♀️', streak: 30 }, { name: 'Bob', avatar: '🧑‍🚀', streak: 25 }, { name: 'Carol', avatar: '🐼', streak: 22 }].map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3 border-b last:border-b-0 py-2">
                      <span className="text-xl">{user.avatar}</span>
                      <span className="font-semibold text-gray-900 flex-1">{user.name}</span>
                      <span className="text-xs text-gray-700">🔥 {user.streak} days</span>
                      <span className="text-xs text-gray-400">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <span className="material-icons text-5xl text-gray-900 mb-2">settings</span>
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <div className="mb-4 text-gray-700">Manage your preferences and account.</div>
              <div className="w-full max-w-xs mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between bg-white rounded-xl shadow p-3">
                  <span className="font-semibold text-gray-900">Dark Mode</span>
                  <button className="w-10 h-6 rounded-full bg-gray-200 flex items-center transition" title="Toggle dark mode">
                    <span className="w-5 h-5 rounded-full bg-primary shadow ml-0.5 transition-transform" style={{ transform: 'translateX(0)' }} />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl shadow p-3">
                  <span className="font-semibold text-gray-900">Notifications</span>
                  <button className="w-10 h-6 rounded-full bg-gray-200 flex items-center transition" title="Toggle notifications">
                    <span className="w-5 h-5 rounded-full bg-primary shadow ml-0.5 transition-transform" style={{ transform: 'translateX(0)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        {/* BottomNav: only show on mobile */}
        <div className="fixed bottom-0 left-0 w-full z-50">
          <div className="max-w-screen-sm mx-auto">
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const { avatar } = useAvatar();
  const { streaks, addStreak, completeStreak, mintStreak } = useStreaks();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", frequency: "daily" });

  // XP/level logic (simple demo)
  const totalCompletions = streaks.reduce((a, s) => a + s.count, 0);
  const level = 1 + Math.floor(totalCompletions / 7);
  const xp = totalCompletions * 10;
  const xpToNext = (level * 7 * 10) - xp;
  const xpPercent = Math.min(100, Math.round((xp / (level * 7 * 10)) * 100));

  // Stats
  const currentStreak = streaks.reduce((max, s) => Math.max(max, s.count), 0);
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.count), 0);
  const completedStreaks = streaks.filter(s => s.completed);
  const activeStreaks = streaks.filter(s => !s.completed);
  const mintedStreaks = streaks.filter(s => s.minted);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addStreak(form.name, form.frequency as "daily" | "weekly");
    setForm({ name: "", frequency: "daily" });
    setShowAdd(false);
  }

  // Top row: mobile header and welcome card
  const mobileHeader = (
    <div className="flex md:hidden w-full justify-end items-center px-2 pt-0 mt-0">
      <HomePageIcons />
    </div>
  );

  const mobileWelcomeCard = (
    <div className="flex md:hidden flex-row items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-lg w-fit max-w-xs ml-2 mt-0 mb-2">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow border-2 border-white">
        {avatar}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-base font-bold tracking-tight text-gray-900 truncate">Welcome to <span className="text-primary">Streakrs!</span></div>
        <div className="text-xs text-gray-700 mb-1 font-medium">Level {level} • {xp} XP</div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${xpPercent}%` }} />
        </div>
      </div>
      <div className="ml-2 flex-shrink-0">
        <ConnectWallet />
      </div>
    </div>
  );

  const desktopTopRow = (
    <div className="hidden md:flex flex-row items-center mt-0 mb-2 w-full gap-2 justify-between px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-lg">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow border-2 border-white mr-2">
        {avatar}
      </div>
      {/* Welcome text and XP */}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold tracking-tight text-gray-900 truncate">Welcome to <span className="text-primary">Streakrs!</span></div>
        <div className="text-sm text-gray-700 mb-1 font-medium">Level {level} • {xp} XP</div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${xpPercent}%` }} />
        </div>
        <div className="text-xs text-gray-700 mt-1">{xpToNext} XP to next level</div>
      </div>
      {/* ConnectWallet */}
      <div className="ml-2 flex-shrink-0">
        <ConnectWallet />
      </div>
      {/* Icons (notifications/profile) */}
      <div className="ml-2 flex-shrink-0 flex items-center gap-2">
        <HomePageIcons />
      </div>
    </div>
  );

  return (
    <>
      {mobileHeader}
      {mobileWelcomeCard}
      {desktopTopRow}
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center mb-4">
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-xs mx-auto border border-gray-100 text-xs">
          <span className="text-lg font-bold text-primary tracking-tight">{streaks.length}</span>
          <span className="text-xs text-gray-900 font-medium">Active</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-xs mx-auto border border-gray-100 text-xs">
          <span className="text-lg font-bold text-secondary tracking-tight">{totalCompletions}</span>
          <span className="text-xs text-gray-900 font-medium">Completions</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-xs mx-auto border border-gray-100 text-xs">
          <span className="text-lg font-bold text-orange-400 tracking-tight">{currentStreak}</span>
          <span className="text-xs text-gray-900 font-medium">Current</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-xs mx-auto border border-gray-100 text-xs">
          <span className="text-lg font-bold text-green-600 tracking-tight">{bestStreak}</span>
          <span className="text-xs text-gray-900 font-medium">Best</span>
        </div>
      </div>

      {/* --- NEW: Quick Links, Tips, Recent Activity --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 border border-primary/10 w-full max-w-xs mx-auto text-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🚀</span>
            <span className="font-bold text-gray-900 tracking-tight">Quick Links</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 transition">Explore</a>
            <a href="#" className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold border border-orange-200 hover:bg-orange-200 transition">Gallery</a>
            <a href="#" className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold border border-purple-200 hover:bg-purple-200 transition">Leaderboard</a>
            <a href="#" className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold border border-green-200 hover:bg-green-200 transition">Friends</a>
            <a href="#" className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold border border-blue-200 hover:bg-blue-200 transition">Stats</a>
          </div>
        </div>
        {/* Tips & Motivation */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 border border-secondary/10 w-full max-w-xs mx-auto text-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💡</span>
            <span className="font-bold text-gray-900 tracking-tight">Tips & Motivation</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 italic">&quot;Success is the product of daily habits—not once-in-a-lifetime transformations.&quot;</div>
          <div className="text-xs text-gray-500">Tip: Add a new streak for something you want to improve this week!</div>
        </div>
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 border border-blue-400/10 w-full max-w-xs mx-auto text-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🕒</span>
            <span className="font-bold text-gray-900 tracking-tight">Recent Activity</span>
          </div>
          <ul className="text-xs sm:text-sm text-gray-700 flex flex-col gap-1">
            <li><span className="text-green-500 font-bold">+1</span> Completed &quot;Read 10 pages&quot;</li>
            <li><span className="text-orange-400 font-bold">🏅</span> Minted NFT for &quot;No Sugar&quot;</li>
            <li><span className="text-primary font-bold">🔥</span> 7-day streak on &quot;Exercise&quot;</li>
            <li><span className="text-blue-500 font-bold">👥</span> Added new friend &quot;Alice&quot;</li>
          </ul>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <button className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-lg hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setShowAdd(true)}>+ Add Streak</button>
        {activeStreaks.length > 0 && (
          <button className="w-full px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold shadow-lg hover:bg-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-400">Claim NFT</button>
        )}
        <button className="w-full px-4 py-2 rounded-lg bg-secondary text-gray-900 font-semibold shadow-lg hover:bg-secondary/80 transition focus:outline-none focus:ring-2 focus:ring-secondary">Share Progress</button>
        <ShareFarcasterButton
          text="Check out my streaks on Streakrs! 🔥"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-screen-sm mx-auto">
        {/* Left Column: Streaks */}
        <div className="flex flex-col gap-6">
          {/* Active Streaks */}
          <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border border-primary/10 text-xs">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex-1">Your Streaks</h3>
              <span className="text-primary font-bold text-lg">{activeStreaks.length}</span>
              <span className="ml-1 text-gray-900 font-medium">active</span>
              <button className="ml-auto px-3 py-1 rounded-lg bg-secondary text-gray-900 text-xs font-semibold hover:bg-secondary/80 transition shadow focus:outline-none focus:ring-2 focus:ring-secondary" onClick={() => setShowAdd(true)}>+ Add</button>
            </div>
            <div className="flex flex-col gap-3">
              {activeStreaks.length === 0 && <div className="text-gray-700 text-sm">No streaks yet. Add a habit to get started!</div>}
              <AnimatePresence>
                {activeStreaks.map((streak) => (
                  <motion.div key={streak.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 shadow border border-gray-100">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-base tracking-tight">{streak.name}</div>
                      <div className="text-xs text-gray-700 font-medium">{streak.frequency} • {streak.count} days</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => completeStreak(streak.id)}>+1</button>
                      <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-900 text-xs font-semibold hover:bg-gray-200 transition shadow focus:outline-none focus:ring-2 focus:ring-gray-300">Reset</button>
                      {streak.completed && !streak.minted && (
                        <motion.button
                          className="px-3 py-1 rounded-lg bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => mintStreak(streak.id)}
                        >
                          Claim NFT
                        </motion.button>
                      )}
                      {streak.minted && (
                        <span className="px-3 py-1 rounded-lg bg-green-200 text-green-800 text-xs font-semibold shadow">NFT Claimed!</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
          {/* Completed Streaks */}
          {completedStreaks.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border border-green-400/10 text-xs">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-bold text-green-700 tracking-tight flex-1">Completed Streaks</h3>
                <span className="text-green-600 font-bold text-lg">{completedStreaks.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {completedStreaks.map((streak) => (
                  <div key={streak.id} className="bg-green-50 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 border border-green-100">
                    <div className="flex-1">
                      <div className="font-bold text-green-900 text-base tracking-tight">{streak.name}</div>
                      <div className="text-xs text-green-700 font-medium">{streak.frequency} • {streak.count} days</div>
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
          {/* NFT Badge Preview (always visible) */}
          <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border border-orange-400/10 text-xs">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex-1">NFT Badges</h3>
              <a href="/gallery" className="text-primary text-xs font-semibold hover:underline">View all</a>
            </div>
            <div className="flex gap-3 flex-wrap min-h-[5rem] items-center justify-center">
              {mintedStreaks.length === 0 ? (
                <div className="text-gray-700 text-sm text-center w-full">No NFT badges yet.<br/>Complete a streak and claim it to mint your first badge!</div>
              ) : (
                mintedStreaks.map((streak) => (
                  <motion.div key={streak.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-xs text-gray-900 font-semibold text-center">{streak.name}</div>
                    <div className="text-xs text-gray-700">7-day streak</div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
          {/* Explore/Suggested Habits */}
          <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border border-blue-400/10 text-xs">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-bold text-blue-700 tracking-tight flex-1">Explore Habits</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Drink Water", "Read 10 pages", "Meditate", "Exercise", "No Sugar", "Sleep by 11pm"].map((habit) => (
                <span key={habit} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 cursor-pointer hover:bg-blue-100 transition">{habit}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Add Streak Modal: ensure w-full, max-w-xs, px-2, py-4 for mobile */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xs flex flex-col gap-4 border border-gray-100" onSubmit={handleAdd}>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">New Streak</h3>
              <input className="border rounded px-3 py-2 text-gray-900 bg-gray-50 text-sm" name="name" placeholder="Streak name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <label htmlFor="frequency" className="sr-only">Frequency</label>
              <select id="frequency" className="border rounded px-3 py-2 text-gray-900 bg-gray-50 text-sm" name="frequency" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition shadow text-sm">Create</button>
                <button type="button" className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition shadow text-sm" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HomePageIcons() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const notificationsBtnRef = useRef<HTMLButtonElement | null>(null);
  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: Event) {
      if (
        notificationsBtnRef.current &&
        !notificationsBtnRef.current.contains(e.target as Node)
      ) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Search icon */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition" aria-label="Search">
        <span className="text-2xl" role="img" aria-label="Search">🔍</span>
      </button>
      {/* Help icon */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition" aria-label="Help">
        <span className="text-2xl" role="img" aria-label="Help">❓</span>
      </button>
      {/* Notification bell */}
      <div className="relative">
        <button
          ref={notificationsBtnRef}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow border-2 border-white dark:border-gray-900 hover:ring-2 hover:ring-primary transition"
          onClick={() => setProfileDropdown((open) => !open)}
        >
          <span className="text-2xl" role="img" aria-label="Notifications">🔔</span>
        </button>
        {profileDropdown && (
          <div className="absolute right-0 top-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 w-72 z-50 flex flex-col animate-fade-in">
            <div className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white border-b">Notifications</div>
            <div className="px-4 py-4 text-gray-500 text-sm">No notifications yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { avatar, setAvatar } = useAvatar();
  const { streaks } = useStreaks();
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
        <div className="bg-white rounded-md shadow-sm p-1 flex flex-col items-center text-xs">
          <span className="text-lg font-bold text-primary">{streaks.length}</span>
          <span className="text-xs text-gray-900">Active</span>
        </div>
        <div className="bg-white rounded-md shadow-sm p-1 flex flex-col items-center text-xs">
          <span className="text-lg font-bold text-secondary">{totalCompletions}</span>
          <span className="text-xs text-gray-900">Completions</span>
        </div>
        <div className="bg-white rounded-md shadow-sm p-1 flex flex-col items-center text-xs">
          <span className="text-lg font-bold text-green-600">{bestStreak}</span>
          <span className="text-xs text-gray-900">Best Streak</span>
        </div>
        <div className="bg-white rounded-md shadow-sm p-1 flex flex-col items-center text-xs">
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

function ShareFarcasterButton({ text }: { text: string }) {
  const openUrl = useOpenUrl();
  const [url, setUrl] = useState("https://streakrs.vercel.app");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);
  const handleShare = () => {
    openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`);
  };
  return (
    <button
      className="w-full px-4 py-2 rounded-lg bg-fuchsia-600 text-white font-semibold shadow-lg hover:bg-fuchsia-700 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
      onClick={handleShare}
    >
      Share via Farcaster
    </button>
  );
}