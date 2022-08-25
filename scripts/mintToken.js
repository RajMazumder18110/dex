const { ethers } = require("ethers");
const DEXToken = require('../src/contracts/DEXToken.json');

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545')
    const signer = provider.getSigner();
    const dexToken = new ethers.Contract(
        DEXToken.networks['5777'].address,
        DEXToken.abi, signer
    )

    const initialSupply = ethers.utils.parseEther('10000000');

    const tx = await dexToken.mintDEXToken(initialSupply);
    const res = await tx.wait();
    console.log(res);
}

main()
