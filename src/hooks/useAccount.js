import { useEffect, useState } from 'react';

const useAccount = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const signIn = async () => {
    try {
      const { ethereum } = window;

      // TODO: エラーを画面に表示する
      if (!ethereum) {
        console.log('Please make sure you have MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAccounts = async () => {
    try {
      const { ethereum } = window;

      // TODO: エラーを画面に表示する
      if (!ethereum) {
        console.log('Please make sure you have MetaMask!');
        return;
      }

      console.log('We have the ethereum object', ethereum);

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAccounts();
  }, []);

  return {
    currentAccount,
    signIn,
  };
};

export default useAccount;
