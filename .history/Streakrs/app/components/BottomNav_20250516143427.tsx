import React, { useState } from "react";

const MAIN_TABS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "gallery", icon: "🖼️", label: "Gallery" },
  { key: "add", icon: "➕", label: "Add" },
  { key: "profile", icon: "👤", label: "Profile" },
];
const MORE_TABS = [
  { key: "leaderboard", icon: "🏆", label: "Leaderboard" },
  { key: "friends", icon: "👥", label: "Friends" },
  { key: "stats", icon: "📈", label: "Stats" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex md:hidden z-50">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 flex flex-col items-center py-2 ${activeTab === tab.key ? "text-primary font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab.key)}
            aria-label={tab.label}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
        {/* More button */}
        <button
          className={`flex-1 flex flex-col items-center py-2 ${MORE_TABS.some(t => t.key === activeTab) ? "text-primary font-bold" : "text-gray-500"}`}
          onClick={() => setShowMore(true)}
          aria-label="More"
        >
          <span className="text-2xl">⋯</span>
          <span className="text-xs">More</span>
        </button>
      </nav>
      {/* More modal */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMore(false)} />
          <div className="relative w-full bg-white rounded-t-2xl shadow-lg p-4 border-t border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">More</span>
              <button className="text-2xl" onClick={() => setShowMore(false)} aria-label="Close">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MORE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex flex-col items-center py-3 rounded-lg ${activeTab === tab.key ? "bg-primary/10 text-primary font-bold" : "text-gray-700"}`}
                  onClick={() => { setActiveTab(tab.key); setShowMore(false); }}
                  aria-label={tab.label}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 