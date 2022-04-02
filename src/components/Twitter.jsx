import twitterLogo from '../assets/twitter-logo.svg';

const TWITTER_HANDLE = 'gentamura84';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Twitter = () => (
  <>
    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />

    <a
      className="footer-text"
      href={TWITTER_LINK}
      target="_blank"
      rel="noreferrer"
    >{`built on @${TWITTER_HANDLE}`}</a>
  </>
);

export default Twitter;
