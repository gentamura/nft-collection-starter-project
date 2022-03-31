import { useEffect, useState } from 'react';

const useAccount = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const init = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
      return;
    }

    console.log('We have the ethereum object', ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No authorized account found');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return [currentAccount, setCurrentAccount];
};

export default useAccount;
