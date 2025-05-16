"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAvatar } from '../context/AvatarContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Home', icon: '🏠', href: '/' },
  { label: 'Streaks', icon: '📅', href: '/streaks' },
  { label: 'Add', icon: '➕', href: '/add' },
  { label: 'Explore', icon: '🔥', href: '/explore' },
  { label: 'Profile', icon: '👤', href: '/profile' },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Dummy state for dark mode (replace with real logic if needed)
  const [dark, setDark] = React.useState<boolean>(false);
  const { avatar } = useAvatar();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  return (
    <div className={dark ? "min-h-screen bg-[#181A20] font-sans" : "min-h-screen bg-background font-sans"}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-30 bg-background flex items-center justify-between px-4 md:px-8 h-16 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
          <span className="font-bold text-2xl text-dark">Streakr</span>
        </div>
        <nav className="hidden md:flex gap-6 text-dark font-semibold items-center">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary transition text-base ${active ? 'bg-primary/10 text-primary' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden sm:inline text-dark group-hover:text-primary group-focus:text-primary">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {/* Visible Search Bar */}
          <form className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1 focus-within:ring-2 focus-within:ring-primary transition">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search streaks, users..."
              className="bg-transparent outline-none text-dark placeholder-gray-400 w-40 md:w-56"
            />
          </form>
          {/* Notifications Bell */}
          <button className="relative p-2 rounded-full hover:bg-primary/10 transition" title="Notifications">
            <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* Connect Wallet Button (MiniKit) */}
          {isClient && <ConnectWallet />}
          {/* User Avatar (global) */}
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg cursor-pointer hover:ring-2 hover:ring-primary transition">
            <span>{avatar}</span>
          </div>
          {/* Dark Mode Toggle */}
          <button
            className="ml-2 p-2 rounded-full hover:bg-primary/10 transition"
            aria-label="Toggle dark mode"
            onClick={() => setDark((d: boolean) => !d)}
          >
            {dark ? (
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            ) : (
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414" /></svg>
            )}
          </button>
        </div>
      </header>
      {/* Main Content Grid */}
      <main className="w-full mx-auto pt-16">
        {/* Left/Center: Feed and main content */}
        <section className="md:col-span-2 flex flex-col gap-8">
          {children}
        </section>
        {/* Right: Sidebar for streaks, explore, leaderboard, profile */}
        <aside className="hidden md:flex flex-col gap-8">
          {/* Sidebar content will be slotted in by page */}
        </aside>
      </main>
    </div>
  );
};

export default MainLayout; 