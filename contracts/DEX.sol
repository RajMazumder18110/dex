// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX is ReentrancyGuard {
    /**
     * @dev Tracking DEXToken exchange rate per ethereum.
     */
    uint256 public dexTokenExchangeRate = 10000;

    /**
     * @dev Tracking exchange fee and total fee collected.
     */
    uint256 public exchangeFee = 0.0002 ether;
    uint256 private collectedFees;


    /**
     * @dev keep track of the owner who deployed the contract.
     */
    address immutable public owner;

    /**
     * @dev Modifiers to check the owner is msg.sender.
     */
    modifier OnlyOwner() {
        require(msg.sender == owner, "OnlyOwner: Only owner can access this function.");
        _;
    }

    /**
     * @dev Modifiers to check whether collected fees is more than zero.
     */
    modifier CollectedFeesMoreThanZero() {
        require(collectedFees > 0, "CollectedFeesMoreThanZero: There is not collected fees.");
        _;
    }

    /**
     * @dev Modifiers to check the owner sent the exchange fee.
     */
    modifier ExchangeFeeSent() {
        require(msg.value >= exchangeFee, "ExchangeFeeSent: Exchange fee is not sent.");
        _;
    }

    /**
     * @dev Modifiers to check the value is more than zero.
     */
    modifier ValueMoreThanZero(uint256 _value) {
        require(_value > 0, "ValueMoreThanZero: Value should not be zero");
        _;
    }

    /**
     * @dev Modifier to check the DEXToken available or not.
     * @param _dexTokenAddress: The contract address of DEXToken.
     */
    modifier DEXTokenAvailableInContract(address _dexTokenAddress){
        uint256 contractBalance = IERC20(_dexTokenAddress).balanceOf(address(this));
        uint256 tokenToSend = (msg.value - exchangeFee) * dexTokenExchangeRate;
        require(contractBalance >= tokenToSend, "DEXTokenAvailableInContract: DEX token is not available.");
        _;
    }

    /**
     * @dev Modifier to check the DEXToken available or not.
     * @param _dexTokenAddress: The contract address of DEXToken.
     */
    modifier DEXTokenAvailableInSender(address _dexTokenAddress, uint256 _tokenAmount){
        uint256 ownerBalance = IERC20(_dexTokenAddress).balanceOf(address(msg.sender));
        require(_tokenAmount <= ownerBalance, "DEXTokenAvailableInSender: DEX token is not available.");
        _;
    }

    /**
     * @dev Event to keep track of swapped values.
     * @param walletAddress: The address who swapped.
     * @param ethValue: The ethereum value.
     * @param dexValue: The DEX token value.
     * @param toDex: Boolean value to check whether address swapped eth with dex
     */
    event TokenSwapped(
        address indexed walletAddress,
        uint256 indexed ethValue,
        uint256 indexed dexValue,
        bool toDex
    );

    /**
     * @dev Assigning the contract deployer to owner.
     */
    constructor(){
        owner = msg.sender;
    }

    /**
     * @dev Function to update DEXToken exchange rate.
     * @param _newRate: The new exchange rate of DEXToken.
     */
    function updateDexTokenExchangeRate(uint256 _newRate) external
        ValueMoreThanZero(_newRate) OnlyOwner {
        dexTokenExchangeRate = _newRate;
    }

    /**
     * @dev Function to update exchange fee.
     * @param _newFee: The new exchange fee.
     */
    function updateExchangeFee(uint256 _newFee) external OnlyOwner {
        exchangeFee = _newFee;
    }

    /**
     * @dev Function to withdraw fees which only accessable from owner account.
     */
    function withdrawFees() external
        ValueMoreThanZero(collectedFees) OnlyOwner {
        payable(owner).transfer(collectedFees);
        collectedFees = 0;
    }

    /**
     * @dev function to swap ether with DEX Token.
     * @param _dexTokenContractAddress: The address of the DEXToken contract.
     */
    function swapETHWithDEXToken(address _dexTokenContractAddress)
     external DEXTokenAvailableInContract(_dexTokenContractAddress) ExchangeFeeSent nonReentrant payable {
        uint256 tokenToSend = (msg.value - exchangeFee) * dexTokenExchangeRate;
        collectedFees += exchangeFee;
        IERC20(_dexTokenContractAddress).transfer(msg.sender, tokenToSend);
        emit TokenSwapped(msg.sender, msg.value - exchangeFee, tokenToSend, true);
    }

    /**
     * @dev function to swap DEX with ETH.
     * @param _dexTokenContractAddress: The address of the DEXToken contract.
     * @param _tokenAmount: The DEX token amount want to sell.
     */
    function swapDEXTokenWithETH(address _dexTokenContractAddress, uint256 _tokenAmount)
     external DEXTokenAvailableInSender(_dexTokenContractAddress, _tokenAmount)
     ExchangeFeeSent nonReentrant payable {
        uint256 ethToSend = (_tokenAmount / dexTokenExchangeRate) - exchangeFee;
        collectedFees += exchangeFee;
        IERC20(_dexTokenContractAddress).transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(ethToSend);
        emit TokenSwapped(msg.sender, ethToSend, _tokenAmount, false);
    }
}