import { base } from 'wagmi/chains';
import { readContract, writeContract } from 'wagmi/actions';
import StreakrNFT_ABI from './StreakrNFT_ABI.json';
import type { Address } from 'viem';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

// Mint NFT
export async function mintNFT(uri: string, account: Address) {
  return writeContract(
    {
      address: STREAKR_NFT_ADDRESS,
      abi: StreakrNFT_ABI,
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
      address: STREAKR_NFT_ADDRESS,
      abi: StreakrNFT_ABI,
      functionName: 'balanceOf',
      args: [address],
    } as const,
    {
      account: address,
      chainId: base.id,
    }
  );
} 