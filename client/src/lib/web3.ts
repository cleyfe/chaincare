import Web3 from 'web3';

let web3: Web3 | null = null;

export const initWeb3 = async () => {
  if (web3) return web3;

  try {
    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    }
    return null;
  } catch (error) {
    console.error('Account access denied');
    return null;
  }
};

export const getAccount = async () => {
  try {
    const web3Instance = await initWeb3();
    if (!web3Instance) return null;

    const accounts = await web3Instance.eth.getAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

export const getBalance = async (address: string) => {
  try {
    const web3Instance = await initWeb3();
    if (!web3Instance) return '0';

    const balance = await web3Instance.eth.getBalance(address);
    return web3Instance.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};