const [deployer] = await ethers.getSigners();
const Contract = await ethers.getContractFactory("StreakrNFT");
const contract = await Contract.deploy();
await contract.deployed();
console.log("StreakrNFT deployed to:", contract.address);

