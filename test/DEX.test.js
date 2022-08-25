const { ethers } = require('ethers')
const { expect } = require('chai')
const DEXToken = artifacts.require("DEXToken")
const DEX = artifacts.require('DEX');

console.clear()
const revertedWithMsg = (e, msg) => {
    return (e.hijackedStack.includes(msg) || e.reason === msg)
}

contract("Decentralize Exchange", accounts => {
    const name = "Decentralize Exchange"
    const symbol = "DEX"

    let dexToken, dex, result

    before(async () => {
        dex = await DEX.deployed();
        dexToken = await DEXToken.deployed();
    })

    // DEX Token //
    describe("DEXToken", () => {
        describe("Deployment", () => {
            it('Should deploy perfectly', async () => {
                expect(dexToken.address).not.to.be.equal('0x0');
                expect(dexToken.address).not.to.be.equal(null);
                expect(dexToken.address).not.to.be.equal('');
            })

            it('Should return name and symbol perfectly', async () => {
                result = await dexToken.name();
                expect(result).to.be.equal(name);
                result = await dexToken.symbol();
                expect(result).to.be.equal(symbol);
            })
        })

        describe("Miniting Token", () => {
            const supply = ethers.utils.parseEther('100000').toString();

            it('Should return initial DEXToken balance of DEX as 0', async () => {
                result = (await dexToken.balanceOf(dex.address)).toString();
                expect(result).to.be.equal('0');
            })

            describe('-Success', () => {
                it('Should mint 1,00,000 token to DEX while sender is owner', async () => {
                    await dexToken.mintDEXToken(supply)
                    result = (await dexToken.balanceOf(dex.address)).toString()
                    result = ethers.utils.formatUnits(result, 'ether');
                    result = Number(result);
                    expect(result).to.be.equal(100000);
                })
            })

            describe('-Faliour', () => {
                it('Should revert minting token while sender is not owner', async () => {
                    try{
                        await dexToken.mintDEXToken(supply, {
                            from: accounts[1]
                        })
                    }catch(e){
                        expect(revertedWithMsg(e, "OnlyOwner: Only owner can access this function."))
                    }
                })

                it('Should revert miniting token while supply is zero', async () => {
                    try{
                        await dexToken.mintDEXToken(0);
                    }catch(e){
                        expect(revertedWithMsg(e, "SupplyMoreThanZero: Supply is zero."))
                    }
                })
            })
        })
    })

    // DEX //
    describe('DEX', () => {
        describe('Deployment', () => {
            it('Should deploy perfectly', async () => {
                expect(dex.address).not.to.be.equal('0x0');
                expect(dex.address).not.to.be.equal(null);
                expect(dex.address).not.to.be.equal('');
            })

            it('Should return initial DEX token exchange rate, exchange fee and owner', async () => {
                result = (await dex.dexTokenExchangeRate()).toString();
                expect(result).to.be.equal('10000');

                result = (await dex.exchangeFee()).toString()
                result = ethers.utils.formatUnits(result, 'ether').toString();
                expect(result).to.be.equal('0.0002');

                result = await dex.owner();
                expect(result).to.be.equal(accounts[0]);
            })
        })

        describe('Updating Exchange Rate', () => {
            const newRate = 15_000;

            describe('-Success', () => {
                it('Should update the token exchange rate while the owner is sender', async () => {
                    await dex.updateDexTokenExchangeRate(newRate);
                    result = (await dex.dexTokenExchangeRate()).toString();
                    expect(result).to.be.equal(String(newRate));
                })
            })

            describe('-faliour', () => {
                it('Should revert update token exchange rate while owner is not sender', async () => {
                    try{
                        await dex.updateDexTokenExchangeRate(newRate, {
                            from: accounts[1]
                        });
                    }catch(e){
                        expect(revertedWithMsg(e, 'OnlyOwner: Only owner can access this function.'));
                    }
                })

                it('Should revert update token exchange rate while new rate is zero', async () => {
                    try{
                        await dex.updateDexTokenExchangeRate(0)
                    }catch(e){
                        expect(revertedWithMsg(e, 'ValueMoreThanZero: Value should not be zero'))
                    }
                })
            })
        })

        describe('Update Exchange Fee', () => {
            const newFee = ethers.utils.parseEther('0.0003').toString();

            describe('-Success', () => {
                it('Should update exchange fee while owner is sender', async () => {
                    await dex.updateExchangeFee(newFee);

                    result = (await dex.exchangeFee()).toString();
                    result = ethers.utils.formatUnits(result, 'ether').toString();
                    expect(result).to.be.equal('0.0003');
                })
            })

            describe('-Faliour', () => {
                it('Should revert update exchange fee while owner is not sender', async () => {
                    try{
                        await dex.updateExchangeFee(newFee, {
                            from: accounts[1]
                        });
                    }catch(e){
                        expect(revertedWithMsg(e, 'OnlyOwner: Only owner can access this function.'))
                    }
                })
            })
        })

        describe('Withdraw Fees at initial position', () => {
            describe('-Faliour', () => {
                it('Should revert withdraw while there is no collected fees', async () => {
                    try{1
                        await dex.withdrawFees();
                    }catch(e){
                        expect(revertedWithMsg(e, 'ValueMoreThanZero: Value should not be zero'))
                    }
                })
            })
        })

        describe('Swapping ETH with DEX', () => {
            // 1 ether + 0.0003 exchange fee
            const exchangeFee = ethers.utils.parseEther('1.0003').toString();
            const ethValue = ethers.utils.parseEther('1').toString();
            const dexValue = ethers.utils.parseEther('15000').toString();

            describe('Success', () => {
                it('Should swap the DEX token with ETH', async () => {
                    result = await dex.swapETHWithDEXToken(dexToken.address, {
                        value: exchangeFee 
                    });

                    expect(result.logs[0].event).to.be.equal('TokenSwapped');
                    expect(result.logs[0].args.walletAddress).to.be.equal(accounts[0]);
                    expect(result.logs[0].args.ethValue.toString()).to.be.equal(ethValue);
                    expect(result.logs[0].args.dexValue.toString()).to.be.equal(dexValue);
                    expect(result.logs[0].args.toDex);

                    result = (await dexToken.balanceOf(dex.address)).toString();
                    result = Number(ethers.utils.formatUnits(result, 'ether'));
                    expect(result).to.be.equal(85_000);
                })

                it('Should return the correct amount of DEXToken owned by the account 1', async () => {
                    result = (await dexToken.balanceOf(accounts[0])).toString();
                    result = Number(ethers.utils.formatUnits(result, 'ether'));
                    expect(result).to.be.equal(15_000);
                })
            })

            describe('Faliour', () => {
                it('Should revert the DEXToken swap while transaction fee is not sent', async () => {
                    try{
                        await dex.swapETHWithDEXToken(dexToken.address)
                    }catch(e){
                        expect(revertedWithMsg(e, 'ExchangeFeeSent: Exchange fee is not sent.'))
                    }
                })
            })
        })

        describe('Swapping DEX with ETH', () => {
            const exchangeFee = ethers.utils.parseEther('0.0003').toString();
            const exchangeToken = ethers.utils.parseEther('15000').toString();
            const ethValue = ethers.utils.parseEther('0.9997').toString();

            describe('-Success', () => {
                it('Should swap the DEX token with ETH', async () => {
                    await dexToken.approve(dex.address, exchangeToken);
                    result = await dex.swapDEXTokenWithETH(dexToken.address, exchangeToken, {
                        value: exchangeFee
                    })

                    expect(result.logs[0].event).to.be.equal('TokenSwapped');
                    expect(result.logs[0].args.walletAddress).to.be.equal(accounts[0]);
                    expect(result.logs[0].args.ethValue.toString()).to.be.equal(ethValue);
                    expect(result.logs[0].args.dexValue.toString()).to.be.equal(exchangeToken);
                    expect(!result.logs[0].args.toDex);


                    result = (await dexToken.balanceOf(dex.address)).toString();
                    result = Number(ethers.utils.formatUnits(result, 'ether'));
                    expect(result).to.be.equal(1_00_000);
                })
            })

            describe('-Faliour', () => {
                it('Should revert swap DEX token with ETH while exchange fee is not sent', async () => {
                    try{
                        await dexToken.approve(dex.address, exchangeToken);
                        await dex.swapDEXTokenWithETH(dexToken.address, exchangeToken)
                    }catch(e){
                        expect(revertedWithMsg(e, 'ExchangeFeeSent: Exchange fee is not sent.'));
                    }
                })

                it('Should revert swap DEX token with ETH while asking for more to swap', async () => {
                    try{
                        await dexToken.approve(dex.address, exchangeToken);
                        await dex.swapDEXTokenWithETH(dexToken.address, exchangeToken);
                    }catch(e){
                        expect(revertedWithMsg(e, 'DEXTokenAvailableInSender: DEX token is not available.'))
                    }
                })
            })
        })
    })
})