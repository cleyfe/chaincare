import Web3 from 'web3';

let web3: Web3;

export const initWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const getBalance = async (address: string) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
};
