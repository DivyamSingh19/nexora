import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs-extra";

dotenv.config();

async function main() {
  const contractNames: string[] = [
    "NFT",
    "Marketplace"
  ];

 
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  const address = await wallet.getAddress();
  
  console.log(`🚀 Deploying contracts with the account: ${address}`);
  
  // Check account balance
  const balance = await provider.getBalance(address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️ Warning: Low account balance. You might not have enough ETH for deployment.");
  }

 
  let existingEnvData = "";
  try {
    existingEnvData = fs.readFileSync(".env.local", "utf8");
  } catch (error) {
    console.warn("No existing .env.local file found. Creating a new one.");
  }

  let newEnvData = "";
  const deploymentInfo: Record<string, any> = {
    network: "sepolia",
    deployer: address,
    contracts: {},
    timestamp: new Date().toISOString()
  };

  // Special case for Marketplace which needs a constructor parameter
  const feePercent = 1; // 1% fee

  for (const contractName of contractNames) {
    try {
      console.log(`🚀 Deploying ${contractName}...`);
      
      const Contract = await ethers.getContractFactory(contractName, wallet);
      
      // Deploy with constructor args if it's the Marketplace contract
      const contract = contractName === "Marketplace" 
        ? await Contract.deploy(feePercent)
        : await Contract.deploy();
      
      await contract.waitForDeployment();
      
      const contractAddress = await contract.getAddress();
      console.log(`✅ ${contractName} deployed at: ${contractAddress}`);
      
      // Save to .env format
      const envKey = `NEXT_PUBLIC_${contractName.toUpperCase()}_ADDRESS`;
      newEnvData += `${envKey}=${contractAddress}\n`;
      
      // Save deployment info
      deploymentInfo.contracts[contractName] = {
        address: contractAddress,
        transactionHash: contract.deploymentTransaction()?.hash
      };
      
      // Add fee percent info for Marketplace
      if (contractName === "Marketplace") {
        deploymentInfo.contracts[contractName].feePercent = feePercent;
      }
    } catch (error) {
      console.error(`❌ Error deploying ${contractName}:`, error);
      throw error;
    }
  }

  // Update .env.local file
  const updatedEnvData = existingEnvData + "\n" + newEnvData;
  fs.writeFileSync(".env.local", updatedEnvData);
  console.log("\n✅ All contract addresses saved to .env.local!");

  // Save deployment information to a deploy-info.json file
  fs.writeFileSync(
    "deploy-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("📝 Deployment information saved to deploy-info.json");
  
  // Verify instructions
  console.log("\n🔍 To verify contracts on Etherscan:");
  for (const contractName of contractNames) {
    const address = deploymentInfo.contracts[contractName].address;
    if (contractName === "Marketplace") {
      console.log(`npx hardhat verify --network sepolia ${address} ${feePercent}`);
    } else {
      console.log(`npx hardhat verify --network sepolia ${address}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });