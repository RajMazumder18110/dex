import { useContext } from "react";
import { Container, Form, FormGroup, Label ,Input, Button } from "reactstrap";
import { DEXContext } from "../contexts/dexContext";

const DEXtoETH = () => {
    const { setActive, walletConnected, handleWalletConnection,
        swapDexValue, swapEthValue, setSwapDexValue, setSwapEthValue 
    } = useContext(DEXContext);

    const handelInput = (e) => {
        setSwapDexValue(Number(e.target.value));
        setSwapEthValue(Number(e.target.value) / 10_000)
    }

    const handelSubmit = (e) => {
        e.preventDefault()
    }

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
                        onChange={(e) => handelInput(e)}
                        valid={swapDexValue > 0}
                    />
                </FormGroup>
                    <i class="fas fa-sync" onClick={() => setActive('ETHtoDEX')}></i>
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
                        valid={swapDexValue > 0}
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
                            }}>10,000 DEX = 1 ETH</p>
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

export default DEXtoETH;