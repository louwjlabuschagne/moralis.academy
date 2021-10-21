const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");
const LINK_TICKER = web3.utils.fromUtf8("LINK");
var BN = web3.utils.BN;
const BUY_ORDER = 0;
const SELL_ORDER = 1;

contract("Dex", accounts => {
    //The user must have ETH deposited such that deposited eth >= buy order value
    it("should throw an error if ETH balance is too low when creating BUY limit order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
            dex.createLimitOrder(BUY_ORDER, LINK_TICKER, 10, 1)
        )
        dex.depositEth({value: 10})
        await truffleAssert.passes(
            dex.createLimitOrder(BUY_ORDER, LINK_TICKER, 10, 1)
        )
    })
    //The user must have enough tokens deposited such that token balance >= sell order amount
    it("should throw an error if token balance is too low when creating SELL limit order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
            dex.createLimitOrder(SELL_ORDER, LINK_TICKER, 10, 1)
        )
        await link.approve(dex.address, 500);
        await dex.deposit(10, LINK_TICKER);
        await truffleAssert.passes(
            dex.createLimitOrder(SELL_ORDER, LINK_TICKER, 10, 1)
        )
    })
    //The BUY order book should be ordered on price from highest to lowest starting at index 0
    it("The BUY order book should be ordered on price from highest to lowest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
        await dex.createLimitOrder(BUY_ORDER, LINK_TICKER, 1, 300)
        await dex.createLimitOrder(BUY_ORDER, LINK_TICKER, 1, 100)
        await dex.createLimitOrder(BUY_ORDER, LINK_TICKER, 1, 200)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
        for (let i = 0; i < orderbook.length - 1; i++) {
            const element = array[index];
            assert(orderbook[i] >= orderbook[i+1])
        }
    })
    //The SELL order book should be ordered on price from lowest to highest starting at index 0
    it("The SELL order book should be ordered on price from lowest to highest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 500);
        await dex.createLimitOrder(SELL_ORDER, web3.utils.fromUtf8("LINK"), 1, 300)
        await dex.createLimitOrder(SELL_ORDER, web3.utils.fromUtf8("LINK"), 1, 100)
        await dex.createLimitOrder(SELL_ORDER, web3.utils.fromUtf8("LINK"), 1, 200)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
        for (let i = 0; i < orderbook.length - 1; i++) {
            const element = array[index];
            assert(orderbook[i] <= orderbook[i+1])
        }
    })
})