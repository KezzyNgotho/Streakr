// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title StreakrNFT - An NFT contract for rewarding habit streaks
contract StreakrNFT is ERC721URIStorage {
    struct Habit {
        string name;
        uint256 frequency; // seconds between check-ins
        uint256 lastCheckIn;
        uint256 streakCount;
        bool exists;
    }

    mapping(address => Habit) public habits;
    mapping(uint256 => uint256) public likes; // tokenId => like count
    mapping(uint256 => uint256) public cheers; // tokenId => cheer count
    uint256 public nextTokenId;

    event HabitRegistered(address indexed user, string name, uint256 frequency);
    event CheckedIn(address indexed user, uint256 streakCount, uint256 timestamp);
    event NFTMinted(address indexed user, uint256 tokenId, string uri);
    event Liked(address indexed user, uint256 tokenId);
    event Cheered(address indexed user, uint256 tokenId);
    event Commented(address indexed user, uint256 tokenId, string comment);

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

    // Register a new habit
    function registerHabit(string memory name, uint256 frequency) public {
        require(!habits[msg.sender].exists, "Already registered");
        habits[msg.sender] = Habit(name, frequency, 0, 0, true);
        emit HabitRegistered(msg.sender, name, frequency);
    }

    // Check in to maintain streak
    function checkIn() public {
        Habit storage habit = habits[msg.sender];
        require(habit.exists, "No habit registered");
        require(block.timestamp >= habit.lastCheckIn + habit.frequency, "Too soon");
        habit.streakCount += 1;
        habit.lastCheckIn = block.timestamp;
        emit CheckedIn(msg.sender, habit.streakCount, block.timestamp);
    }

    // Mint NFT if streakCount >= threshold
    function mintIfStreak(uint256 minStreak, string memory uri) public returns (uint256) {
        Habit storage habit = habits[msg.sender];
        require(habit.exists, "No habit registered");
        require(habit.streakCount >= minStreak, "Streak too low");
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMinted(msg.sender, tokenId, uri);
        // Optionally reset streak
        // habit.streakCount = 0;
        return tokenId;
    }

    // Like an NFT
    function like(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        likes[tokenId] += 1;
        emit Liked(msg.sender, tokenId);
    }

    // Cheer an NFT
    function cheer(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        cheers[tokenId] += 1;
        emit Cheered(msg.sender, tokenId);
    }

    // Comment on an NFT (emits event only)
    function comment(uint256 tokenId, string memory commentText) public {
        require(_exists(tokenId), "Token does not exist");
        emit Commented(msg.sender, tokenId, commentText);
    }
}
