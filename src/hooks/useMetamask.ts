import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const useMetamask = () => {

  interface Network {
    chainId: number,
    name: string,
    ensAddress: string
  };

  const [connected, setConnected] = useState<null |'failed' | 'pending' | 'success'>(null);
  const [walletAddress, setWalletAddress] = useState<null | string>(null);
  const [provider, setProvider] = useState<null | ethers.providers.JsonRpcProvider>(null);
  const [network, setNetwork] = useState<null | Network>(null);
  const [balance, setBalance] = useState<null | string>(null);

  useEffect(() => {
    (
      async() => {
        if(provider && walletAddress) {
          const balance = await (window as any).provider.getBalance(walletAddress);
          const balanceInEth = ethers.utils.formatEther(balance);
          setBalance(balanceInEth);
        }
      }
    )();
  }, [provider, walletAddress, network]);

  // public
  const connectToMetamask = async() => {
    initState();
    const provider = await detectCurrentProvider();
    if (!provider) {
      setConnected('failed');
      return;
    }

    await getWalletAddress();
    await getNetwork();

    changeNetworkListener();
    changeAccountListener();

    setProvider(provider);
    setConnected('success');
  }

  const initState = () => {
    setNetwork(null);
    setWalletAddress(null);
    setConnected('pending');
  }

  // private
  const detectCurrentProvider = () => {
    let provider: any = false;
    if (window) {
      if ((window as any).ethereum) {
        provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
          'any'
        );
      } 
      else if ((window as any).web3) {
        provider = (window as any).web3.currentProvider;
      }
      else {
        console.warn(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        );
      }
    }
    if (provider) (window as any).provider = provider;
    return provider;
  };

  const changeNetworkListener = () => {
    (window as any).ethereum.on('chainChanged', async function () {
      await getNetwork();
    });
  };

  const changeAccountListener = () => {
    (window as any).ethereum.on('accountsChanged', async function () {
      await getWalletAddress();
    })
  }

  const getNetwork = async() => {
    const currentNetwork = await (window as any).provider.getNetwork();
    setNetwork(currentNetwork);
  }

  const getWalletAddress = async() => {
    const address = await (window as any).ethereum.request({method: 'eth_requestAccounts'});
    setWalletAddress(address[0]);
  }

  return {
    connected,
    walletAddress,
    provider,
    network,
    connectToMetamask,
    balance
  }
}

export default useMetamask;