pragma solidity 0.7.5;

import './ownable.sol';
import './destroyable.sol';

contract Bank is Ownable, Destroyable {
    
    mapping (address => uint) balance;
    uint tvl;//Total Value Locked
    
    
    function desposit() public payable returns (uint){
        balance[msg.sender] += msg.value;
        tvl += msg.value;
        return balance[msg.sender];
        
        
    }
    
    function withdrawAll() public onlyOwner {
        msg.sender.transfer(tvl);
        tvl = 0;
    }
    
    
    function transfer(address _to, uint _amount) public  {
        require(balance[msg.sender] >= _amount, "Not enough ETH in address to transfer");
        _transfer(msg.sender, _to, _amount);
    }
    
    function balanceOf(address _address) public view returns (uint){
        
        return balance[_address];
    }
    
    function _transfer(address _from, address _to, uint _amount) private{
        
        balance[_from] -= _amount;
        balance[_to] += _amount;
    }
    
}