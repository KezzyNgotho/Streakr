require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    base: {
      url: process.env.BASE_RPC_URL, // Set in .env
      accounts: [process.env.PRIVATE_KEY], // Set in .env
      chainId: 8453, // Use 84531 for Base Goerli
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC_URL, // Set in .env
      accounts: [process.env.PRIVATE_KEY], // Set in .env
      chainId: 84531,
    },
  },
};