import { base } from 'wagmi/chains';
import { readContract, writeContract } from 'wagmi/actions';
import StreakrNFT_ABI from './StreakrNFT_ABI.json';
import type { Address } from 'viem';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

export const streakrNFTConfig = {
  address: STREAKR_NFT_ADDRESS,
  abi: StreakrNFT_ABI,
};

// Mint NFT
export async function mintNFT(uri: string, account: Address) {
  return writeContract(
    {
      ...streakrNFTConfig,
      functionName: 'mint',
      args: [uri],
    } as const,
    {
      account,
      chainId: base.id,
    }
  );
}

// Get balance of NFTs for a user
export async function getNFTBalance(address: Address) {
  return readContract(
    {
      ...streakrNFTConfig,
      functionName: 'balanceOf',
      args: [address],
    } as const,
    {
      account: address,
      chainId: base.id,
    }
  );
}

// Example: Get tokenId owned by user (simple, assumes sequential IDs)
export async function getTokenOfOwnerByIndex(address: string, index: number) {
  // If contract supports ERC721Enumerable, use tokenOfOwnerByIndex
  // Otherwise, you may need to scan tokenIds
} 