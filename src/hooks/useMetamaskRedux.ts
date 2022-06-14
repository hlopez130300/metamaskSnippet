import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAppSelector, useAppDispatch } from '../app/store';
import { 
  resetConnection, 
  pendingConnection,
  successConnection, 
  failedConnection, 
  changeNetwork, 
  changeAddress,
  setBalance
} from '../slices/metamaskSlice';

const useMetamaskRedux = () => {

  const [provider, setProvider] = useState<null | ethers.providers.JsonRpcProvider>(null);

  const {
    metamask: { walletAddress, network, balance, connected },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (
      async() => {
        if(provider && walletAddress) {
          const balance = await (window as any).provider.getBalance(walletAddress);
          const balanceInEth = ethers.utils.formatEther(balance);
          dispatch(setBalance(balanceInEth));
        }
      }
    )();
  }, [provider, walletAddress, network, dispatch]);

  // public
  const connectToMetamask = async() => {
    dispatch(resetConnection());
    dispatch(pendingConnection());
    const provider = await detectCurrentProvider();
    if (!provider) {
      dispatch(failedConnection())
      return;
    }

    const address = await getWalletAddress();
    const network = await getNetwork();

    changeNetworkListener();
    changeAccountListener();

    setProvider(provider);
    dispatch(successConnection({ 
      walletAddress: address,
      network: network
    }));
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
      const network = await getNetwork();
      dispatch(changeNetwork(network));
    });
  };

  const changeAccountListener = () => {
    (window as any).ethereum.on('accountsChanged', async function () {
      const address = await getWalletAddress();
      dispatch(changeAddress(address));
    })
  }

  const getNetwork = async() => {
    const { chainId, name } = await (window as any).provider.getNetwork();
    return { chainId, name };
  }

  const getWalletAddress = async() => {
    const address = await (window as any).ethereum.request({method: 'eth_requestAccounts'});
    return address[0];
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

export default useMetamaskRedux;