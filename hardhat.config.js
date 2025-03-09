require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.error("❌ Private key not found! Make sure you have a .env file with PRIVATE_KEY set.");
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
          url: process.env.ALCHEMY_SEPOLIA_URL || "https://fragrant-smart-water.ethereum-sepolia.quiknode.pro/c74e154188c6a54dd690c0e23f69e115306d0a56/",
          accounts: [privateKey] 
    },
  },
};
