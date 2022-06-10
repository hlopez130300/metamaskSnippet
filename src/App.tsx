import React from 'react';
import './App.css';
import useMetamask from './hooks/useMetamask';
import useMetamaskRedux from './hooks/useMetamaskRedux';
import metamaskFox from './metamask-fox.png';

function App() {

  const { connectToMetamask, connected, walletAddress, network, balance } = useMetamaskRedux();

  return (
    <div className="App">
      <p>Connected: {connected}</p>
      <p>Wallet Address: {walletAddress}</p>
      <p>Network Id: {network?.chainId}</p>
      <p>Network Name: {network?.name}</p>
      <p>Balance: {balance}</p>
      <button onClick={() => connectToMetamask()} className="MetamaskButton">
        <div className="MetamaskButtonContent">
          Connect To Metamask 
         <img src={metamaskFox} alt="Metamask Fox" className="MetamaskLogo"/>
        </div>
      </button>
    </div>
  );
}

export default App;
