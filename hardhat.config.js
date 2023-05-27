require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },

  network: {
    hardhat: {
      chainId: 31337,
    },

    sepolia: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.ACCOUNT],
      chainId: 11151111,
    },
  },
};
