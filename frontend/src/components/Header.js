import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/greenlogo.svg";
import "../assets/scss/pages/_header.scss";

function Header() {
  const [wallet, setWallet] = useState(null);

  // Try auto-connect if wallet already authorized
  useEffect(() => {
    const tryConnect = async () => {
      if (window.mathbatWallet) {
        try {
          const data = await window.mathbatWallet.connect();
          setWallet(data);
        } catch {
          setWallet(null);
        }
      }
    };

    tryConnect();
  }, []);

  const connectWallet = async () => {
    if (!window.mathbatWallet) {
      window.open(
        "https://chrome.google.com/webstore/detail/your-wallet-id"
      );
      return;
    }

    try {
      const data = await window.mathbatWallet.connect();
      setWallet(data);
    } catch {
      alert("Wallet connection failed");
    }
  };

  const shortAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="header">
      <div className="row">

        <div className="col-md-11 header-responsive header-icons-box">

          {/* WALLET BUTTON */}
          {!wallet ? (
            <div
              className="header-buttons header-buttons-login"
              onClick={connectWallet}
            >
              
              Connect Wallet
            </div>
          ) : (
            <Link to="/account" title="Wallet Address">
              <div className="header-buttons">
                {shortAddress(wallet.address)}
              </div>
            </Link>
          )}

          {/* HOME BUTTON */}
          <Link title="home" to="/">
            <div className="header-buttons">
              <i className="fa-solid fa-house header-buttons-ico"></i>
            </div>
          </Link>

        </div>

        {/* LOGO */}
        <div className="col-md-1">
          <div className="logo-button">
            <Link to="/">
              <img
                className="logo-img"
                src={logo}
                alt="MATHBOT Logo"
              />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Header;
