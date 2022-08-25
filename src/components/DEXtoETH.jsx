import { useContext, useState, useEffect } from "react";
import { Container, Form, FormGroup, Label ,Input, Button } from "reactstrap";
import { DEXContext } from "../contexts/dexContext";
import { ethers } from "ethers";
import LastSwapped from "./LastSwapped";

const DEXtoETH = () => {
    const { setActive, walletConnected, handleWalletConnection,
        swapDexValue, swapEthValue, setSwapDexValue, setSwapEthValue,
        dex, dexToken, account, exchangeFee, dexRate, ethBalance, lastData
    } = useContext(DEXContext);
    const [dexBalance, setDexBalance] = useState('');
    const [fetched, setFetched] = useState(true);
    const setFetchedValue = () => setFetched(!fetched);

    const handelInput = (e) => {
        setSwapDexValue(Number(e.target.value));
        setSwapEthValue(Number(e.target.value) / dexRate)
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        if(swapDexValue > 0){
            try{
                const fee = ethers.utils.parseEther(String(exchangeFee));
                const dexTokenValue = ethers.utils.parseEther(String(swapDexValue)).toString();
                
                let tx = await dexToken.approve(dex.address, dexTokenValue);
                await tx.wait();

                tx = await dex.swapDEXTokenWithETH(dexToken.address, dexTokenValue, {
                    value: fee
                })
                await tx.wait();
                setFetchedValue();
                alert('Token Swapped');
            }catch(e){
                alert("Error occured while transaction")
            }
        }else{
            alert('ETH value should be more than zero')
        }
    }

    useEffect(() => {
        const get = async () => {
            let bal = (await dexToken.balanceOf(account)).toString();
            bal = ethers.utils.formatUnits(bal, 'ether').toString();
            setDexBalance(bal);
        }
        walletConnected && get()
    }, [fetched, walletConnected])

    return (
        <Container className="dex-container">
            <Form onSubmit={(e) => handelSubmit(e)}>
                <h4 className="heading">Decentralize Exchange</h4>
                <FormGroup>
                    <Label for="dexValue" style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 0
                    }}>
                        <div>
                            <i className="fas fa-project-diagram me-2"></i>DEX
                        </div>
                        <p className="text-muted" style={{
                            fontSize: '0.8rem'
                        }}>Balance : {dexBalance} DEX</p>
                    </Label>
                    <Input
                        type='number'
                        placeholder="0.0"
                        name="dex"
                        id="dexValue"
                        value={swapDexValue}
                        onChange={(e) => handelInput(e)}
                        valid={swapDexValue > 0}
                    />
                </FormGroup>
                    <i className="fas fa-sync" onClick={() => setActive('ETHtoDEX')}></i>
                <FormGroup>

                </FormGroup>

                <FormGroup>
                    <Label for="ethValue" style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 0
                    }}>
                        <div>
                            <i className="fa-brands fa-ethereum me-2"></i>ETH
                        </div>
                        <p className="text-muted" style={{
                            fontSize: '0.8rem'
                        }}>Balance : {ethBalance} ETH</p>
                    </Label>
                    <Input
                        type='number'
                        placeholder="0.0"
                        name="eth"
                        id="ethValue"
                        value={swapEthValue}
                        valid={swapDexValue > 0}
                        readOnly
                    />
                    <Label style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        marginTop: '0.5rem'
                    }}>
                        <div className="d-flex" style={{ justifyContent: 'space-between'}}>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>Exchange rate</p>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>{dexRate} DEX = 1 ETH</p>
                        </div>
                        <div className="d-flex" style={{ justifyContent: 'space-between'}}>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>Exchange fee</p>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}><i className="fa-brands fa-ethereum me-2"></i>{exchangeFee}</p>
                        </div>
                    </Label>
                </FormGroup>

                <FormGroup>
                    {walletConnected ? 
                        <Button className="w-100 custom-btn">Swap</Button>
                        :
                        <Button className="w-100 custom-btn"
                            onClick={handleWalletConnection}
                        >Connect</Button>
                    }
                </FormGroup>
            </Form>
            <LastSwapped lastData={lastData} />
        </Container>
    )
}

export default DEXtoETH;