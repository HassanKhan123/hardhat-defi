const { ethers } = require("hardhat");

const networkConfig = {
  4: {
    name: "rinkeby",
    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: "8058",
    callbackGaslimit: "500000",
    interval: "30",
  },
  31337: {
    name: "hardhat",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGaslimit: "500000",
    interval: "30",
  },
};

const developmentChains = ["hardhat", "localhost"];
const WETH_TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const AMOUNT = ethers.utils.parseEther("0.01");
const DAI_ETH_PRICE_FEED = "0x773616E4d11A78F511299002da57A0a94577F1f4";
const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

module.exports = {
  networkConfig,
  developmentChains,
  WETH_TOKEN_ADDRESS,
  AMOUNT,
  DAI_ETH_PRICE_FEED,
  DAI_TOKEN_ADDRESS,
};
