pragma solidity 0.7.5;
pragma abicoder v2;

contract MultiSigWallet{
    
    mapping (address => uint) balance;
    address public approver1;
    address public approver2;
    address public approver3;
    uint public minApprovers;
    
    struct transferRequest {
        address payable _to;
        uint _amount;
        uint _approver1;
        uint _approver2;
        uint _approver3;
    }
    
    transferRequest[] transferRequests;
    
    constructor (address _approver1, address _approver2, address _approver3, uint _minApprovers){
        require(_approver1 == address(_approver1),"Invalid address 1");
        require(_approver2 == address(_approver2),"Invalid address 2");
        require(_approver3 == address(_approver3),"Invalid address 3");
        require(_minApprovers > 1, "It's mutlisig, not singlesig...");
        
        minApprovers = _minApprovers;
        approver1 = _approver1;
        approver2 = _approver2;
        approver3 = _approver3;
        
    }
    
    function getBalance() view public returns (uint){
        return address(this).balance;
    }
    
    // function that receives money into the multi-sig wallet
    function deposit() public payable{
        balance[msg.sender] += msg.value;
    }
    
    function requestTransfer(address payable _to, uint _amount) public {
        transferRequests.push(transferRequest(_to, _amount, 0, 0, 0));
    }
    
    function viewTransfer(uint _index) view public returns(transferRequest memory){
        return transferRequests[_index];
    }
    
    // function that approves transferRequest _index - sender must be one of the approvers set up in the constructor
    function approveTransfer(uint _index) public {
        require(msg.sender == approver1 || msg.sender == approver2 || msg.sender == approver3, "sender not 1 of the approvers");
        require(_index < transferRequests.length, "Transfer Request Index out of bounds");
        if (msg.sender == approver1){
            transferRequests[_index] = transferRequest(transferRequests[_index]._to, transferRequests[_index]._amount, 1, transferRequests[_index]._approver2, transferRequests[_index]._approver3);
        }
        if (msg.sender == approver2){
            transferRequests[_index] = transferRequest(transferRequests[_index]._to, transferRequests[_index]._amount, transferRequests[_index]._approver1, 1, transferRequests[_index]._approver3);
        }
        if (msg.sender == approver3){
            transferRequests[_index] = transferRequest(transferRequests[_index]._to, transferRequests[_index]._amount, transferRequests[_index]._approver1, transferRequests[_index]._approver2, 1);
        }
    }
    
    // Method that checks if the transfer _index has at least minApprovers approved, and if so, does the transfer
    function transfer(uint _index) public{
        require(msg.sender == approver1 || msg.sender == approver2 || msg.sender == approver3, "sender not 1 of the approvers");
        
        transferRequest memory tRequest = transferRequests[_index];
        uint nrApproved = tRequest._approver1 + tRequest._approver2 + tRequest._approver3;
        
        if(nrApproved >= minApprovers){
            address payable toAddres = tRequest._to;
            toAddres.transfer(tRequest._amount);
            tRequest._amount = 0;
            transferRequests[_index] = tRequest;
        }
        
    }
}