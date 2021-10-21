pragma solidity 0.8.0;

contract HelloWorld {

    string message = "Hello World";
    function setMessage(string memory _message) public payable {
        message = _message;
    }
 
    function hello() public view returns (string memory) {
        return message;
    }
}
