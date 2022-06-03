import React from 'react';
import './App.css';
import useMetamask from './connector/metamask';
import metamaskFox from './metamask-fox.png';

function App() {

  const { connectToMetamask } = useMetamask();

  return (
    <div className="App">
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
