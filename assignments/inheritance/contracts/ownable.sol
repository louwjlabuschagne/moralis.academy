pragma solidity 0.7.5;


contract Ownable {
    
    address payable owner;

    modifier onlyOwner {
        require(msg.sender == owner, "only owner is allowed to do this");
        _;
    }

    constructor(){
        owner = msg.sender;
    }
}