import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext.js";
import logo from "../assets/images/greenlogo.svg";
import "../assets/scss/pages/_header.scss";

function Header() {
  const { wallet, connectWallet } = useWallet();

  const shortAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="header">
      <div className="row">

        <div className="col-md-11 header-responsive header-icons-box">

          {/* WALLET BUTTON */}
          {!wallet ? (
            <div
              className="header-buttons"
              onClick={connectWallet}
              title="Connect Wallet"
            >
              <i className="fa-solid fa-wallet header-buttons-ico"></i>
            </div>
          ) : (
            <Link to="/" title={wallet.address}>
              <div className="header-buttons">
                {shortAddress(wallet.address)}
              </div>
            </Link>
          )}

          {/* HOME BUTTON */}
          <Link title="Home" to="/">
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
