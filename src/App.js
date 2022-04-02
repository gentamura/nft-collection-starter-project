import twitterLogo from './assets/twitter-logo.svg';
import useAccount from './hooks/useAccount';
import useContract from './hooks/useContract';
import './styles/App.css';

const TWITTER_HANDLE = 'gentamura84';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { currentAccount, signIn } = useAccount();
  const { checkContract, TotalCount, isMintDisabled, askContractToMintNft } =
    useContract();

  console.log('currentAccount: ', currentAccount);

  const connectWallet = async () => {
    try {
      await signIn();
      await checkContract();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>

          {currentAccount === '' ? (
            <button
              onClick={connectWallet}
              className="cta-button connect-wallet-button"
            >
              Connect to Wallet
            </button>
          ) : (
            <>
              <TotalCount />

              <button
                onClick={askContractToMintNft}
                className="cta-button connect-wallet-button"
                disabled={isMintDisabled}
              >
                Mint NFT
              </button>
            </>
          )}
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
