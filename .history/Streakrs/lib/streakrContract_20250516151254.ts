import { base } from 'wagmi/chains';
import { readContract, writeContract } from 'wagmi/actions';
import StreakrNFT_ABI from './StreakrNFT_ABI.json';
import type { Address } from 'viem';
import { getContract } from 'wagmi';

export const STREAKR_NFT_ADDRESS = '0xA67264D67Ea9fa84c820004E32d45B93c9C0CE65';

// Mint NFT
export async function mintNFT(uri: string, account: Address) {
  const contract = getContract({
    addressOrName: STREAKR_NFT_ADDRESS,
    contractInterface: StreakrNFT_ABI,
    signerOrProvider: ...,
  });
  await contract.mint(uri);
}

// Get balance of NFTs for a user
export async function getNFTBalance(address: Address) {
  return readContract(
    {
      address: STREAKR_NFT_ADDRESS,
      abi: StreakrNFT_ABI,
      functionName: 'balanceOf',
      args: [address],
    },
    {
      account: address,
      chainId: base.id,
    }
  );
} 