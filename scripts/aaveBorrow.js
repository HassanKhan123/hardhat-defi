const { getNamedAccounts, ethers } = require("hardhat");
const {
  WETH_TOKEN_ADDRESS,
  AMOUNT,
  DAI_ETH_PRICE_FEED,
  DAI_TOKEN_ADDRESS,
} = require("../helper-hardhat-config");

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
  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  );

  const daiPrice = await getDaiPrice();

  // 0.95 -----> only borrow 95% of the available borrows
  const amountDaiToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
  console.log(`You can borrow ${amountDaiToBorrow} DAI`);
  const amountDaiToBorrowWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  );
  await borrowDai(
    DAI_TOKEN_ADDRESS,
    lendingPool,
    amountDaiToBorrowWei,
    deployer
  );
  await getBorrowUserData(lendingPool, deployer);
  await repay(amountDaiToBorrowWei, DAI_TOKEN_ADDRESS, lendingPool, deployer);
  await getBorrowUserData(lendingPool, deployer);
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

const getBorrowUserData = async (lendingPool, account) => {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);

  console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
  console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
  console.log(`You can borrow ${availableBorrowsETH} worth of ETH `);

  return { availableBorrowsETH, totalDebtETH };
};

const getDaiPrice = async () => {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    DAI_ETH_PRICE_FEED
  );
  const price = (await daiEthPriceFeed.latestRoundData())[1];
  console.log("The DAI/ETH price is", price.toString());
  return price;
};

const borrowDai = async (
  daiAddress,
  lendingPool,
  amountDaiToBorrowWei,
  account
) => {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrowWei,
    1,
    0,
    account
  );
  borrowTx.wait(1);
  console.log("You have borrowed!!");
};

const repay = async (amount, daiAddress, lendingPool, account) => {
  await approveErc20(daiAddress, lendingPool.address, amount, account);
  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
  await repayTx.wait(1);
  console.log("Repayed");
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
