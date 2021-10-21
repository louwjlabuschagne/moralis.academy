const Link = artifacts.require("Link");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Link);


  // If we specify a limit order, then we specify the amount and price
  // If we specify a marker order, then we we just specify the amount and we get the best price

  // Sell Orders (Asks)
  // D: Sell 5 ETH for 3 LINK/ETH
  // E: Sell 5 ETH for 2 LINK/ETH
  // Amount| Price
  // -------------
  // 5 ETH | 3 LINK/ETH
  // 5 ETH | 2 LINK/ETH


  // Buy Orders (Bids)
  // Person A Speficy amount and price (10 ETH for 2 LINK/ETH)
  // Person B Speficy amount and price (5 ETH for 1.5 LINK/ETH)

  // One row per price! SO if Person C comes at (5 ETH for LINK/ETH), then 15 | 2
  // Higest price is at the top
  // Amount| Price
  // -------------
  // 15   |  2.0
  //  5   |  1.5

};
