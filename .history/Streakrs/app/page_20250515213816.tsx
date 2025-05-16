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
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
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

        <main className="flex-1">
          {activeTab === "home" && <HomePage />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}

function HomePage() {
  const { avatar } = useAvatar();
  const { streaks } = useStreaks();

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      {/* Welcome Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl shadow-lg border-4 border-white">{avatar}</div>
        <div className="flex-1">
          <div className="text-xl font-bold text-dark">Welcome to Streakrs!</div>
          <div className="text-light text-sm mb-1">Connect your wallet to start tracking habits and earning NFT badges.</div>
        </div>
        <div className="ml-auto">
          <ConnectWallet chainId={42220} connectWalletText="Connect Wallet" />
        </div>
      </div>
      {/* Streak Summary */}
      <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border-t-4 border-primary/80 mb-8">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-bold text-dark flex-1">Your Streaks</h3>
          <span className="text-primary font-bold text-lg">{streaks.length}</span>
          <span className="ml-1 text-dark">active</span>
        </div>
        <div className="flex flex-col gap-2">
          {streaks.length === 0 && <div className="text-light text-sm">No streaks yet. Add a habit to get started!</div>}
          {streaks.slice(0, 2).map((streak) => (
            <div key={streak.id} className="bg-primary/10 rounded-xl px-3 py-2 flex flex-col">
              <div className="font-bold text-dark">{streak.name}</div>
              <div className="text-xs text-light">{streak.frequency} • {streak.count} days</div>
            </div>
          ))}
        </div>
      </section>
      {/* NFT Badge Preview */}
      <section className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border-t-4 border-orange-400/80">
        <div className="flex items-center mb-1">
          <h3 className="text-lg font-bold text-dark flex-1">NFT Badges</h3>
          <a href="/gallery" className="text-primary text-xs font-semibold">View all</a>
        </div>
        <div className="flex gap-3">
          {/* Placeholder for NFT badges */}
          <div className="flex flex-col items-center bg-orange-50 rounded-xl shadow p-3 w-20 border border-gray-100">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-dark font-semibold text-center">7-day streak</div>
          </div>
        </div>
      </section>
    </div>
  );
}
