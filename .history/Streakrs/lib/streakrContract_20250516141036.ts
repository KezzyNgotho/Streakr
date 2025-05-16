import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { getContract, readContract, writeContract } from 'wagmi/actions';
import StreakrNFT_ABI from './StreakrNFT_ABI.json';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

export const streakrNFTConfig = {
  address: STREAKR_NFT_ADDRESS,
  abi: StreakrNFT_ABI,
  chainId: base.id,
};

// Example: Mint NFT
export async function mintNFT(uri: string) {
  return writeContract({
    ...streakrNFTConfig,
    functionName: 'mint',
    args: [uri],
  });
}

// Example: Get balance of NFTs for a user
export async function getNFTBalance(address: string) {
  return readContract({
    ...streakrNFTConfig,
    functionName: 'balanceOf',
    args: [address],
  });
}

// Example: Get tokenId owned by user (simple, assumes sequential IDs)
export async function getTokenOfOwnerByIndex(address: string, index: number) {
  // If contract supports ERC721Enumerable, use tokenOfOwnerByIndex
  // Otherwise, you may need to scan tokenIds
} 