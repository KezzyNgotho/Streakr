import { getContract } from '@wagmi/core';
import StreakrNFT_ABI from './StreakrNFT_ABI.json';
import type { Address } from 'viem';
import { ethers } from 'ethers';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

// Mint NFT
export async function mintNFT(uri: string, account: Address, signer: ethers.Signer) {
  const contract = getContract({
    addressOrName: STREAKR_NFT_ADDRESS,
    contractInterface: StreakrNFT_ABI,
    signerOrProvider: signer,
  });
  return contract.mint(uri);
}

// Get balance of NFTs for a user
export async function getNFTBalance(address: Address, provider: ethers.providers.Provider) {
  const contract = getContract({
    addressOrName: STREAKR_NFT_ADDRESS,
    contractInterface: StreakrNFT_ABI,
    signerOrProvider: provider,
  });
  return contract.balanceOf(address);
} 