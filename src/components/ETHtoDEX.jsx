import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { Container, Form, FormGroup, Label ,Input, Button } from "reactstrap";
import { DEXContext } from "../contexts/dexContext";

const ETHtoDEX = () => {
    const { setActive, walletConnected, handleWalletConnection,
        swapEthValue, swapDexValue, setSwapEthValue,  setSwapDexValue,
        dex, dexToken, account, exchangeFee, dexRate, ethBalance
    } = useContext(DEXContext);

    const [dexBalance, setDexBalance] = useState('');
    const [fetched, setFetched] = useState(true);
    const setFetchedValue = () => setFetched(!fetched);

    const handelInput = (e) => {
        setSwapEthValue(Number(e.target.value));
        setSwapDexValue(Number(e.target.value) * dexRate);
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        if(swapEthValue > 0){
            try{
                const ethValue = ethers.utils.parseEther(String(swapEthValue + Number(exchangeFee)));
                const tx = await dex.swapETHWithDEXToken(dexToken.address, {
                    value: ethValue
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
                        onChange={(e) => handelInput(e)}
                        valid={swapEthValue > 0}
                    />
                </FormGroup>
                
                <FormGroup>
                    <i className="fas fa-sync" onClick={() => setActive('DEXtoETH')}></i>
                </FormGroup>
                
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
                        valid={swapEthValue > 0}
                        readOnly
                    />
                    <Label style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '0.5rem'
                    }}>
                        <div className="d-flex" style={{ justifyContent: 'space-between'}}>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>Exchange rate</p>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>1 ETH = {dexRate} DEX</p>
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
        </Container>
    )
}

export default ETHtoDEX;