const { getNamedAccounts, ethers } = require("hardhat");
const { WETH_TOKEN_ADDRESS, AMOUNT } = require("../helper-hardhat-config");

const getWeth = async () => {
  const { deployer } = await getNamedAccounts();
  const iWeth = await ethers.getContractAt(
    "IWeth",
    WETH_TOKEN_ADDRESS,
    deployer
  );
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
  return wethBalance;
};

module.exports = { getWeth };
