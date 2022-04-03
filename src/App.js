import Twitter from './components/Twitter';
import useAccount from './hooks/useAccount';
import useContract from './hooks/useContract';
import './styles/App.css';

const App = () => {
  const { currentAccount, signIn } = useAccount();
  const { initContract, Contract } = useContract();

  const connectWallet = async () => {
    try {
      await signIn();
      await initContract();
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
            <Contract />
          )}
        </div>

        <div className="footer-container">
          <Twitter />
        </div>
      </div>
    </div>
  );
};

export default App;
