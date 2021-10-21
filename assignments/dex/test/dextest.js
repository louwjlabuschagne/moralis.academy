const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");
const LINK_TICKER = web3.utils.fromUtf8("LINK");
var BN = web3.utils.BN;
const BUY = 0;
const SELL = 1;

contract("Dex", (accounts) => {
  it("should not be possible to set a limit buy order valued higher than ETH available", async () => {
    let dex = await Dex.deployed();

    let balanceInWei = await web3.eth.getBalance(accounts[0]);
    let balance = new BN(balanceInWei);
    let halfBalance = balance.div(new BN(2));

    await truffleAssert.reverts(
      dex.createLimitOrder(LINK_TICKER, BUY, new BN(5), halfBalance, {
        from: accounts[0],
      })
    );

    await truffleAssert.passes(
      dex.createLimitOrder(LINK_TICKER, BUY, new BN(1), halfBalance, {
        from: accounts[0],
      })
    );
  });

  it("should not be possible to set a limit sell order for more tokens than you own", async () => {
    let dex = await Dex.deployed();
    let tokenBalance = await dex.balances(accounts[0], LINK_TICKER);

    await truffleAssert.reverts(
      dex.createLimitOrder(
        LINK_TICKER,
        SELL,
        tokenBalance.add(new BN(1)),
        new BN(1)
      )
    );

    await truffleAssert.reverts(
      dex.createLimitOrder(
        LINK_TICKER,
        SELL,
        tokenBalance.sub(new BN(1)),
        new BN(1)
      )
    );
  });

  it("should be that the BUY orderbook is sorted in a decreasing order based on price", async () => {
    let dex = await Dex.deployed();
    let orderBook = await dex.getOrderBook(LINK_TICKER, BUY);

    let previousPrice = new BN(orderBook[0][5]); //Index 5 is the price
    for (let i = 1; i < orderBook.length; i++) {
      let currentPrice = new BN(orderBook[i][5]);
      assert(currentPrice.gt(previousPrice), "Order book is not sorted");
      previousPrice = currentPrice;
    }
  });

  it("should be that the SELL orderbook is sorted in an ascending order based on price", async () => {
    let dex = await Dex.deployed();
    let orderBook = await dex.getOrderBook(LINK_TICKER, SELL);

    let previousPrice = new BN(orderBook[0][5]);
    for (let i = 1; i < orderBook.length; i++) {
      let currentPrice = new BN(orderBook[i][5]);
      assert(currentPrice.lt(previousPrice), "Order book is not sorted");
      previousPrice = currentPrice;
    }
  });
});
