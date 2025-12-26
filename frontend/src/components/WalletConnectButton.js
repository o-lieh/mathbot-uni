import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext.js";
import "../assets/scss/_modal.scss";

function ContestRegisterModal({ contestId, onClose }) {
  const { wallet, connectWallet } = useWallet();

  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    if (!wallet) {
      connectWallet();
      return;
    }

    setLoading(true);
    try {
      // later: payment logic here
      alert("Registered successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="contest-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Contest Registration</h2>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        <button
          className="wallet-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : wallet
            ? "Pay & Register"
            : "Connect Wallet"}
        </button>

        {wallet && (
          <p className="wallet-ok">
            Wallet connected: {wallet.address}
          </p>
        )}
      </div>
    </div>
  );
}

export default ContestRegisterModal;
