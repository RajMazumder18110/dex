import { useContext } from "react";
import { Container, Form, FormGroup, Label ,Input, Button } from "reactstrap";
import { DEXContext } from "../contexts/dexContext";

const ETHtoDEX = () => {
    const { setActive, walletConnected, handleWalletConnection,
        swapEthValue, swapDexValue, setSwapEthValue,  setSwapDexValue
    } = useContext(DEXContext);

    const handelInput = (e) => {
        setSwapEthValue(Number(e.target.value));
        setSwapDexValue(Number(e.target.value) * 10_000);
    }

    const handelSubmit = (e) => {
        e.preventDefault()
    }

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
                            <i class="fa-brands fa-ethereum me-2"></i>ETH
                        </div>
                        <p className="text-muted" style={{
                            fontSize: '0.8rem'
                        }}>Balance : 99.09 ETH</p>
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
                    <i class="fas fa-sync" onClick={() => setActive('DEXtoETH')}></i>
                </FormGroup>
                
                <FormGroup>
                    <Label for="dexValue" style={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 0
                    }}>
                        <div>
                            <i class="fas fa-project-diagram me-2"></i>DEX
                        </div>
                        <p className="text-muted" style={{
                            fontSize: '0.8rem'
                        }}>Balance : 15,000 DEX</p>
                    </Label>
                    <Input
                        type='number'
                        placeholder="0.0"
                        name="dex"
                        id="dexValue"
                        value={swapDexValue}
                        valid={swapEthValue > 0}
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
                            }}>1 ETH = 10,000 DEX</p>
                        </div>
                        <div className="d-flex" style={{ justifyContent: 'space-between'}}>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}>Exchange fee</p>
                            <p className="text-muted" style={{
                                fontSize: '0.8rem'
                            }}><i class="fa-brands fa-ethereum me-2"></i>0.0003</p>
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