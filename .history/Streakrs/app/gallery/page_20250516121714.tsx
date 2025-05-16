"use client";
import { useState } from "react";

export default function GalleryPage() {
  // Mock NFT data
  const [nfts, setNfts] = useState([
    // { tokenId: 0, uri: "/splash.png" },
    // { tokenId: 1, uri: "/logo.png" },
  ]);

  // TODO: Replace with contract read for owned NFTs

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="text-2xl font-bold text-dark">NFT Gallery</div>
          <div className="text-light text-sm">View your earned habit badges as NFTs!</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {nfts.length === 0 ? (
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
    </div>
  );
} 