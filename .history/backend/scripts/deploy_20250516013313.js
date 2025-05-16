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