// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title StreakrNFT - An NFT contract for rewarding habit streaks
contract StreakrNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("StreakrNFT", "STREAKR") {}

    /// @notice Mints a new NFT to the given address with metadata URI
    /// @param to The address receiving the NFT
    /// @param uri The metadata URI for the NFT
    /// @return tokenId The ID of the newly minted token
    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }
}
