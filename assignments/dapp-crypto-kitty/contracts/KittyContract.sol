pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Kitty is ERC721 {

    string public constant name = "Kitty";
    string public constant symbol = "KTY";

    struct Kitty {
        uint256 genes;
        uint256 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping (uint256 => address) public kittyIndexToOwner;
    mapping (address => uint256) public ownershipTokenCount;


    constructor() ERC721("Kitty", "KTY"){

    }
    
} 