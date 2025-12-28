import React from "react";

function WalletConnectButton({ onConnected }) {
  const connectWallet = async () => {
    if (!window.mathbatWallet) {
      window.open(
        "https://chrome.google.com/webstore/detail/your-wallet-id"
      );
      return;
    }

    try {
      const wallet = await window.mathbatWallet.connect();
      onConnected(wallet);
    } catch (err) {
      alert("Wallet connection failed");
    }
  };

  return (
    <button onClick={connectWallet}>
      اتصال کیف پول
    </button>
  );
}

export default WalletConnectButton;
