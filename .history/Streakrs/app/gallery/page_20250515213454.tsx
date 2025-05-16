"use client";

export default function GalleryPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-8 pb-28">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="text-2xl font-bold text-dark">NFT Gallery</div>
          <div className="text-light text-sm">View your earned habit badges as NFTs!</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* NFT badge cards will go here */}
        <div className="col-span-2 md:col-span-4 text-center text-light py-12">No NFTs yet. Earn a streak badge to see it here!</div>
      </div>
    </div>
  );
} 