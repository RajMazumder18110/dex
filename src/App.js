import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import DEXtoETH from "./components/DEXtoETH";
import ETHtoDEX from "./components/ETHtoDEX";
import NavBar from "./components/Navbar";
import { DEXContext } from "./contexts/dexContext";

import DEX from './contracts/DEX.json';
import DEXToken from './contracts/DEXToken.json';

import './scss/index.scss';

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('x0hd8s-xxx-9hs8e2s')
  const [active, setActive] = useState('ETHtoDEX');
  const [swapEthValue, setSwapEthValue] = useState(0);
  const [swapDexValue, setSwapDexValue] = useState(0);
  const [dex, setDex] = useState(null);
  const [dexToken, setDexToken] = useState(null);
  const [exchangeFee, setExchangeFee] = useState(0);
  const [dexRate, setDexRate] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [lastData, setLastData] = useState({})

  let provider;

  const handleWalletConnection = async () => {
    try{
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({ method:'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const { chainId } = await provider.getNetwork();

        const dex = new ethers.Contract(
          DEX.networks[chainId.toString()].address, 
          DEX.abi, signer
        )
        const dexToken = new ethers.Contract(
          DEXToken.networks[chainId.toString()].address,
          DEXToken.abi, signer
        )
        
        let bal = (await provider.getBalance(accounts[0])).toString();
        bal = ethers.utils.formatUnits(bal, 'ether');

        setEthBalance(bal);
        setDex(dex);
        setDexToken(dexToken);
        setAccount(accounts[0]);
        setWalletConnected(true);
      }else{
        alert('Please install metamask :(')
      }
    }catch(e){
      alert('Error occured');
      console.log(e);
    }
  }

  if(typeof window.ethereum !== 'undefined'){
    window.ethereum.on('accountsChanged', accounts => {
      setAccount(accounts[0]);
    })
  }

  useEffect(() => {
    const init = async () => {
      dex.on('TokenSwapped', (walletAddress, ethValue, dexValue, toDex) => {
        const data = {
          walletAddress,
          toDex,
          ethValue: ethers.utils.formatUnits(ethValue.toString(), 'ether').toString(),
          dexValue: ethers.utils.formatUnits(dexValue.toString(), 'ether').toString()
        }
        setLastData(data);
      })

      let ef = await dex.exchangeFee();
      ef = ethers.utils.formatUnits(ef.toString(), 'ether').toString();
      setExchangeFee(ef);

      let er = await dex.dexTokenExchangeRate();
      setDexRate(er.toString());
    }
    walletConnected && init();
  }, [walletConnected])

  return (
    <DEXContext.Provider value={{
      walletConnected, setWalletConnected,
      active, setActive,
      swapEthValue, setSwapEthValue,
      swapDexValue, setSwapDexValue,
      handleWalletConnection, account,
      dex, dexToken, exchangeFee, dexRate, ethBalance,
      lastData
    }}>
      <Container>
        <NavBar />
        { active === 'ETHtoDEX' ? <ETHtoDEX /> : <DEXtoETH /> }
      </Container>
    </DEXContext.Provider>
  );
}

export default App;
