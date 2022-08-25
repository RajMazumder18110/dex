const DEXToken = artifacts.require("DEXToken")
const DEX = artifacts.require('DEX');

const name = "Decentralize Exchange"
const symbol = "DEX"

module.exports = async (deployer) => {
    await deployer.deploy(DEX);
    const dex = await DEX.deployed();

    await deployer.deploy(DEXToken, name, symbol, dex.address);  
}