async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const StreakrNFT = await ethers.getContractFactory("StreakrNFT");
    const streakrNFT = await StreakrNFT.deploy();
    await streakrNFT.waitForDeployment(); // Correct for Ethers v6

    console.log("StreakrNFT deployed to:", streakrNFT.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
