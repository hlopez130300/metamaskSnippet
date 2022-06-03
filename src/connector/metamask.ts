import React, { useState } from 'react';
import { ethers } from 'ethers';

const useMetamask = () => {

  const [connected, setConnected] = useState<undefined | string>();
  const [walletAdress, setWalletAddress] = useState();
  const [provider, setProvider] = useState(null);

  // public
  const connectToMetamask = async() => {
    setConnected('pending');
    const provider = await detectCurrentProvider();
  
    if (!provider) {
      setConnected('failed');
    }
    const { address, status } = await getWalletAddress();
    if (status === 'connected') {
      setWalletAddress(address[0]);
    }
    setProvider(provider);
    setConnected('success');
  }

  const getNetwork = async() => {
    if ((window as any).provider) {
      await getChainId();
    } else {
      await connectToMetamask();
      await getChainId();
    }
  }

  // private
  const detectCurrentProvider = () => {
    let provider: any = false;
    if (window) {
      if ((window as any).ethereum) {
        provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
      } 
      else if ((window as any).web3) {
        provider = (window as any).web3.currentProvider;
      } 
      else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        );
      }
    }
    if (provider) (window as any).provider = provider;
    return provider;
  };

  const getWalletAddress = async() => {
    let address, status;
    if ((window as any).ethereum) {
      address = await (window as any).ethereum.request({method: 'eth_requestAccounts'});
      if (!address) await connectToMetamask();
      status = 'connected';
    } else {
      status = 'failed';
    }
    return { address, status };
  }

  const getChainId = async() => {
    const { chainId, name } = await (window as any).provider.getNetwork();
    return { chainId, name };
  }

  return {
    connected,
    walletAdress,
    provider,
    connectToMetamask,
    getNetwork
  }
}

export default useMetamask;