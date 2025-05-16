const [deployer] = await ethers.getSigners();
const Contract = await ethers.getContractFactory("StreakrNFT");
const contract = await Contract.deploy();
await contract.deployed();
console.log("StreakrNFT deployed to:", contract.address);

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const StreakrNFT = await ethers.getContractFactory("StreakrNFT");
    const streakrNFT = await StreakrNFT.deploy();
    await streakrNFT.waitForDeployment();
  
    console.log("StreakrNFT deployed to:", streakrNFT.target);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });