// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DEXToken is ERC20 {
    /**
     * @dev Keep tracking of DEX contract address.
     */
    address immutable dexAddress;

    /**
     * @dev keep track of the owner who deployed the contract
     */
    address immutable owner;

    /**
     * @dev Modifiers to check the owner is msg.sender
     */
    modifier OnlyOwner() {
        require(msg.sender == owner, "OnlyOwner: Only owner can access this function.");
        _;
    }

    /**
     * @dev Modifiers to check the supply is not zero
     */
    modifier SupplyMoreThanZero(uint _supply) {
        require(_supply > 0, "SupplyMoreThanZero: Supply is zero.");
        _;
    }

    /**
     * @dev Initilizing the ERC20 contract and also initilize the dexAddress.
     * @param _name: The name of the token.
     * @param _symbol: The symbol of the token.
     * @param _dexAddress: The DEX Contract address.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _dexAddress
    ) ERC20(_name, _symbol){
        dexAddress = _dexAddress;
        owner = msg.sender;
    }

    /**
     * @dev Minting the token to DEX contract with initial supply.
     * @param _initialSupply: The initial supply of that token.
     */
    function mintDEXToken(uint _initialSupply) external
        OnlyOwner SupplyMoreThanZero(_initialSupply) {
        _mint(dexAddress, _initialSupply);
    }
}