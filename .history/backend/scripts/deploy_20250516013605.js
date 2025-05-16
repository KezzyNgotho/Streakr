const [deployer] = await ethers.getSigners();
const Contract = await ethers.getContractFactory("StreakrNFT");
const contract = await Contract.deploy();
await contract.deployed();
console.log("StreakrNFT deployed to:", contract.address);

async function main() {
    const StreakrNFT = await ethers.getContractFactory("StreakrNFT");
    const streakrNFT = await StreakrNFT.deploy();
    await streakrNFT.deployed();
    console.log("StreakrNFT deployed to:", streakrNFT.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });