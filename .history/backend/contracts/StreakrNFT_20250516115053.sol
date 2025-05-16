// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title StreakrNFT - An NFT contract for rewarding habit streaks
contract StreakrNFT is ERC721URIStorage {
    uint256 public nextTokenId;

    constructor() ERC721("StreakrNFT", "STREAKR") {}

    /// @notice Mints a new NFT to the sender with metadata URI
    /// @param uri The metadata URI for the NFT
    /// @return tokenId The ID of the newly minted token
    function mint(string memory uri) public returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }
}
