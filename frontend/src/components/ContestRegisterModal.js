import React, { useState } from "react";
import WalletConnectButton from "./WalletConnectButton.js";
import { payWithWallet } from "../services/paymentService.js";

function ContestRegisterModal({ contestId, onClose }) {
  const [teamName, setTeamName] = useState("");
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);

    try {
      await payWithWallet({
        contestId,
        teamName,
        wallet
      });

      alert("Payment successful! Registration completed");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Contest Registration</h2>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {!wallet ? (
          <WalletConnectButton onConnected={setWallet} />
        ) : (
          <p className="wallet-ok">
            Wallet connected: {wallet.address}
          </p>
        )}

        <button disabled={loading} onClick={handlePayment}>
          Pay with Wallet
        </button>

      </div>
    </div>
  );
}

export default ContestRegisterModal;
