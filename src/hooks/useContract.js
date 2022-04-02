import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import myEpicNft from '../utils/MyEpicNFT.json';
import useAccount from './useAccount';

const CONTRACT_ADDRESS = '0x694DD1639AD138A79e0A1271561878f8F415c6b0';
const RINKEBY_CHAIN_ID = '0x4';

const useContract = () => {
  const { currentAccount } = useAccount();
  const [contract, setContract] = useState();
  const [mintMaxCount, setMintMaxCount] = useState(0);
  const [mintCount, setMintCount] = useState(0);
  const [isValidNetwork, setIsValidNetwork] = useState(false);

  const askContractToMintNft = async () => {
    console.log('Going to pop wallet now to pay gas...');

    let nftTxn = await contract.makeAnEpicNFT();

    console.log('Mining...please wait.');

    await nftTxn.wait();

    console.log(
      `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
    );
  };

  // NOTE: NFTの発行済個数をセットする
  const updateCurrentMintCount = async (contract) => {
    const mintMaxCountAsBigNumber = await contract.MAX_SUPPLY();
    const mintCountAsBigNumber = await contract.getMintCount();

    // NOTE: 取得できる値はBigNumberなのでparseが必要
    setMintMaxCount(mintMaxCountAsBigNumber.toNumber());
    setMintCount(mintCountAsBigNumber.toNumber());
  };

  const checkNetwork = async (ethereum) => {
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    setIsValidNetwork(chainId === RINKEBY_CHAIN_ID)
  };

  const checkContract = useCallback(async (ethereum) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicNft.abi,
      signer
    );

    // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
    connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
      // TODO: alertではなく、application上で表示する
      alert(
        `あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );

      updateCurrentMintCount(connectedContract);
    });

    setContract(connectedContract);
    updateCurrentMintCount(connectedContract);
  }, []);

  const initContract = useCallback(async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        await checkNetwork(ethereum);

        if (isValidNetwork) await checkContract(ethereum);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }, [isValidNetwork, checkContract]);

  useEffect(() => {
    if (currentAccount) initContract();
  }, [currentAccount, initContract]);


  const TotalCount = () => (
    <div className="sub-text">
      これまでに作成された {mintCount}/{mintMaxCount} NFT
    </div>
  );

  const MintButton = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
      disabled={mintCount === mintMaxCount}
    >
      Mint NFT
    </button>
  );

  const Contract = () => (
    isValidNetwork ? (
      <>
        <TotalCount />
        <MintButton />
      </>
    ) : (
      <div className="sub-text">
        You are not connected to the Rinkeby Test Network!
      </div>
    )
  );

  return { initContract, Contract };
};

export default useContract;
