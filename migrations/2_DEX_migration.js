const { ethers } = require('ethers')
const DEXToken = artifacts.require("DEXToken")
const DEX = artifacts.require('DEX');

const name = "Decentralize Exchange"
const symbol = "DEX"

module.exports = async (deployer) => {
    const initialSupply = ethers.utils.parseEther('10000000');

    await deployer.deploy(DEX);
    const dex = await DEX.deployed();

    await deployer.deploy(DEXToken, name, symbol, dex.address, initialSupply);  
}