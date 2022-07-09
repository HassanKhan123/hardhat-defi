const {
  RINKEBY_RPC_URL,
  PRIVATE_KEY,
  COINMARKET_API_KEY,
  ETHERSCAN_API_KEY,
  MAINNET_RPC_URL,
} = require("./secret");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.8", version: "0.4.19" },
      { version: "0.6.12" },
      { version: "0.6.6" },
      { version: "0.6.0" },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmation: 1,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    rinkeby: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 200000,
  },
};
