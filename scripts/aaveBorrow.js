const { getNamedAccounts, ethers } = require("hardhat");
const { WETH_TOKEN_ADDRESS, AMOUNT } = require("../helper-hardhat-config");

const { getWeth } = require("./getWeth");

const main = async () => {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  const lendingPool = await getLendingPool(deployer);
  console.log("Lending pool address", lendingPool.address);
  await approveErc20(WETH_TOKEN_ADDRESS, lendingPool.address, AMOUNT, deployer);
  console.log("DEPOSITNG");
  await lendingPool.deposit(WETH_TOKEN_ADDRESS, AMOUNT, deployer, 0);
  console.log("DEPOSITED");
};

const getLendingPool = async account => {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );

  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();

  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );

  return lendingPool;
};

const approveErc20 = async (
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) => {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  );

  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log("Approved!");
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
