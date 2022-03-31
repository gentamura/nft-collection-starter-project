import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json';
import './styles/App.css';
import useAccount from "./hooks/useAccount";

// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = 'gentamura84';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';

const CONTRACT_ADDRESS = '0x694DD1639AD138A79e0A1271561878f8F415c6b0';

const App = () => {
  const [currentAccount, setCurrentAccount] = useAccount();
  const [mintMaxCount, setMintMaxCount] = useState(0);
  const [mintCount, setMintCount] = useState(0);

  console.log("currentAccount: ", currentAccount);

  // NOTE: NFTの発行済個数をセットする
  const setCurrentMintCount = async (connectedContract) => {
    const mintMaxCountAsBigNumber = await connectedContract.MAX_SUPPLY();
    console.log('mintMaxCountAsBigNumber', mintMaxCountAsBigNumber);

    const mintCountAsBigNumber = await connectedContract.getMintCount();

    // NOTE: 取得できる値はBigNumberなのでparseが必要
    setMintMaxCount(mintMaxCountAsBigNumber.toNumber());
    setMintCount(mintCountAsBigNumber.toNumber());
  };

  const setupEventListener = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        setCurrentMintCount(connectedContract);

        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());

          alert(`あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);

          setCurrentMintCount(connectedContract);
        });
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (error) {
      console.log(error)
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        console.log("Going to pop wallet now to pay gas...")

        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Mining...please wait.")

        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (currentAccount) {
      setupEventListener();

      console.log("Found an authorized account:", currentAccount);
    } else {
      console.log("No authorized account found")
    }
  }, [currentAccount, setupEventListener]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
          あなただけの特別な NFT を Mint しよう💫
          </p>

          {
            currentAccount === "" ? (
              <button onClick={connectWallet} className="cta-button connect-wallet-button">
                Connect to Wallet
              </button>
            ) : (
              <>
                <div className="sub-text">
                  これまでに作成された { mintCount }/{ mintMaxCount } NFT
                </div>

                <button onClick={askContractToMintNft} className="cta-button connect-wallet-button" disabled={mintCount === mintMaxCount}>
                  Mint NFT
                </button>
              </>
            )
          }
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
