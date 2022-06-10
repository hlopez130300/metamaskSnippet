import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

interface Network {
  chainId: number,
  name: string,
};

interface MetamaskState {
  connected: 'failed' | 'pending' | 'success' | null;
  walletAddress: null | string;
  network: null | Network;
  balance: null | string;
}

const initialState: MetamaskState = {
  connected: null,
  walletAddress: null,
  network: null,
  balance: null
}

export const metamaskSlice = createSlice({
  name: "metamask",
  initialState,
  reducers: {
    resetConnection: (state) => {
      state.connected = null;
      state.walletAddress = null;
      state.network = null;
      state.balance = null;
    },
    pendingConnection: (state) => {
      state.connected = 'pending';
    },
    successConnection: (state, action: PayloadAction<any>) => {
      console.log('action dispatched');
      const { connected, walletAddress, network } = action.payload;
      state.connected = connected;
      state.walletAddress = walletAddress;
      state.network = network;
    },
    failedConnection: (state) => {
      state.connected = 'failed';
      state.walletAddress = null;
      state.network = null;
      state.balance = null;
    },
    changeNetwork: (state, action: PayloadAction<Network> ) => {
      state.network = action.payload;
    },
    changeAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
    },
    setBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    }
  }
});

export const { 
  resetConnection, 
  pendingConnection, 
  successConnection, 
  failedConnection,
  changeNetwork,
  changeAddress,
  setBalance
} = metamaskSlice.actions; 

export default metamaskSlice.reducer;