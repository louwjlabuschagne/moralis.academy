pragma solidity ^0.8.0;
pragma abicoder v2;

import "./wallet.sol";

contract Dex is Wallet {
    using SafeMath for uint256;

    enum Side {
        BUY,
        SELL
    }

    struct Order {
        uint256 id;
        address trader;
        Side side;
        bytes32 ticker;
        uint256 amount; //in ETH
        uint256 price;
    }

    mapping(bytes32 => mapping(uint256 => Order[])) public orderBook;

    function getOrderBook(bytes32 ticker, Side side)
        public
        view
        returns (Order[] memory)
    {
        return orderBook[ticker][uint256(side)];
    }

    function createLimitOrder(
        bytes32 _ticker,
        Side _side,
        uint256 _amount,
        uint256 _price
    ) public {
        Order memory order;
        order.id = orderBook[_ticker][uint256(_side)].length;
        order.trader = msg.sender;
        order.side = _side;
        order.ticker = _ticker;
        order.amount = _amount;
        order.price = _price;
        orderBook[_ticker][uint(_side)].push(order);
    }
}
