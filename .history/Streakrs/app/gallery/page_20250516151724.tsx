"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getNFTBalance, streakrNFTConfig } from "../../lib/streakrContract";
import { readContract } from "wagmi/actions";
import { ethers } from "ethers";
import StreakrNFT_ABI from './StreakrNFT_ABI.json';
import type { Address } from 'viem';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

// Mint NFT
export async function mintNFT(uri: string, signer: ethers.Signer) {
  const contract = new ethers.Contract(
    STREAKR_NFT_ADDRESS,
    StreakrNFT_ABI,
    signer
  );
  return contract.mint(uri);
}

// Get balance of NFTs for a user
export async function getNFTBalance(address: Address, provider: ethers.providers.Provider) {
  const contract = new ethers.Contract(
    STREAKR_NFT_ADDRESS,
    StreakrNFT_ABI,
    provider
  );
  return contract.balanceOf(address);
}

export default function GalleryPage() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<{ tokenId: number; uri: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) return;
      setLoading(true);
      try {
        const balance = await getNFTBalance(address, ethers.provider);
        const nftList = [];
        for (let i = 0; i < Number(balance); i++) {
          // Try to fetch tokenURI for each tokenId (assume sequential minting)
          try {
            const uri = await readContract({
              ...streakrNFTConfig,
              functionName: "tokenURI",
              args: [i],
            });
            nftList.push({ tokenId: i, uri: uri as string });
          } catch (e) {
            // skip if not owned
          }
        }
        setNfts(nftList);
      } catch (e) {
        setNfts([]);
      }
      setLoading(false);
    }
    fetchNFTs();
  }, [address]);

  // Mock feed/leaderboard data
  const [feed, setFeed] = useState([
    { type: "CheckedIn", user: "0x123...abcd", streak: 5, time: "2m ago" },
    { type: "NFTMinted", user: "0x456...ef12", tokenId: 1, time: "10m ago" },
    { type: "Liked", user: "0x789...3456", tokenId: 0, time: "15m ago" },
    { type: "Cheered", user: "0xabc...7890", tokenId: 1, time: "20m ago" },
    { type: "Commented", user: "0xdef...1234", tokenId: 0, comment: "Great job!", time: "25m ago" },
  ]);
  // TODO: Replace with contract event listening for a live feed

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="text-2xl font-bold text-dark">NFT Gallery</div>
          <div className="text-light text-sm">View your earned habit badges as NFTs!</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-2 md:col-span-4 text-center text-light py-12">
            Loading NFTs...
          </div>
        ) : nfts.length === 0 ? (
          <div className="col-span-2 md:col-span-4 text-center text-light py-12">
            No NFTs yet. Earn a streak badge to see it here!
          </div>
        ) : (
          nfts.map((nft) => (
            <div key={nft.tokenId} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={nft.uri} alt={`NFT ${nft.tokenId}`} className="w-full h-32 object-cover rounded" />
              <div className="mt-2 text-center text-dark font-semibold">Token #{nft.tokenId}</div>
              {/* Social actions will go here */}
            </div>
          ))
        )}
      </div>
      <div className="mt-12">
        <div className="text-xl font-bold text-dark mb-4">Feed & Leaderboard (Mock)</div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
          {feed.map((item, i) => (
            <div key={i} className="mb-2 text-sm text-dark">
              {item.type === "CheckedIn" && (
                <span>✅ <b>{item.user}</b> checked in (streak: {item.streak}) <span className="text-light">{item.time}</span></span>
              )}
              {item.type === "NFTMinted" && (
                <span>🏅 <b>{item.user}</b> minted NFT #{item.tokenId} <span className="text-light">{item.time}</span></span>
              )}
              {item.type === "Liked" && (
                <span>❤️ <b>{item.user}</b> liked NFT #{item.tokenId} <span className="text-light">{item.time}</span></span>
              )}
              {item.type === "Cheered" && (
                <span>🎉 <b>{item.user}</b> cheered NFT #{item.tokenId} <span className="text-light">{item.time}</span></span>
              )}
              {item.type === "Commented" && (
                <span>💬 <b>{item.user}</b> commented on NFT #{item.tokenId}: "{item.comment}" <span className="text-light">{item.time}</span></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 