import { useState } from "react";
import { Container } from "reactstrap";
import DEXtoETH from "./components/DEXtoETH";
import ETHtoDEX from "./components/ETHtoDEX";
import NavBar from "./components/Navbar";
import { DEXContext } from "./contexts/dexContext";

import './scss/index.scss';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('x0hd8s-xxx-9hs8e2s')
  const [active, setActive] = useState('ETHtoDEX');
  const [swapEthValue, setSwapEthValue] = useState(0);
  const [swapDexValue, setSwapDexValue] = useState(0);

  const handleWalletConnection = () => {
    setWalletConnected(true);
  }

  return (
    <DEXContext.Provider value={{
      walletConnected, setWalletConnected,
      active, setActive,
      swapEthValue, setSwapEthValue,
      swapDexValue, setSwapDexValue,
      handleWalletConnection, account
    }}>
      <Container>
        <NavBar />
        { active === 'ETHtoDEX' ? <ETHtoDEX /> : <DEXtoETH /> }
      </Container>
    </DEXContext.Provider>
  );
}

export default App;
