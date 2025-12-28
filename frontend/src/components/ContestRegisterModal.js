import React, { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext.js";
import { payForContest } from "../services/paymentService.js";
import "../assets/scss/_modal.scss";

function ContestRegisterModal({ contestId, onClose }) {
  const { wallet, connectWallet } = useWallet();

  const [teamName, setTeamName] = useState("");
  const [contestPrice, setContestPrice] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [txHash, setTxHash] = useState("");

  /* ---------- ERROR MAPPER ---------- */
  const getErrorMessage = (type) => {
    switch (type) {
      case "NO_WALLET":
        return "MetaMask is not installed.";
      case "REJECTED":
        return "Transaction was rejected.";
      case "INSUFFICIENT_FUNDS":
        return "Insufficient balance.";
      case "WRONG_NETWORK":
        return "Please switch to Sepolia network.";
      case "CONTRACT_ERROR":
        return "Transaction failed on-chain.";
      default:
        return "Something went wrong. Try again.";
    }
  };

  /* ---------- LOAD CONTEST ---------- */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/contests/${contestId}/`)
      .then((r) => r.json())
      .then((d) => setContestPrice(Number(d.registration_price) || 0))
      .catch(() => setContestPrice(0));
  }, [contestId]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!teamName.trim()) return alert("Enter team name");
    if (!wallet) return connectWallet();

    contestPrice === 0
      ? handleFreeRegistration()
      : handlePaidRegistration();
  };

  /* ---------- FREE ---------- */
  const handleFreeRegistration = async () => {
    try {
      setStatus("processing");

      const res = await fetch(
        `http://127.0.0.1:8000/api/contests/${contestId}/register-free/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: wallet.address,
            team_name: teamName,
          }),
        }
      );

      const data = await res.json();
      setCode(data.unique_code || `FREE-${Date.now()}`);
      setStatus("success");
    } catch {
      setError("Free registration failed");
      setStatus("error");
    }
  };

  /* ---------- PAID ---------- */
  const handlePaidRegistration = async () => {
    try {
      setStatus("processing");
      setError("");

      const { txHash, receiptHash } = await payForContest({
        contestId,
        priceEth: contestPrice,
      });

      setTxHash(txHash);
      setCode(`PAID-${receiptHash.slice(2, 10).toUpperCase()}`);
      setStatus("success");
    } catch (err) {
      setError(getErrorMessage(err.type));
      setStatus("error");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="contest-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        {/* ---------- IDLE ---------- */}
        {status === "idle" && (
          <>
            <h2>Contest Registration</h2>

            <input
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <button className="wallet-btn" onClick={handleSubmit}>
              {!wallet
                ? "Connect Wallet"
                : contestPrice === 0
                ? "Register for Free"
                : `Pay ${contestPrice} ETH`}
            </button>
          </>
        )}

        {/* ---------- PROCESSING ---------- */}
        {status === "processing" && (
          <div className="message-box info">
            <span className="message-icon">⏳</span>
            <p>Processing transaction...</p>
          </div>
        )}

        {/* ---------- SUCCESS ---------- */}
        {status === "success" && (
          <div className="message-box success">
            <span className="message-icon">✔</span>
            <h3>Registration Successful</h3>

            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              📋 Click to copy registration code
            </button>

            {txHash && (
              <button
                className="copy-button secondary"
                onClick={() => navigator.clipboard.writeText(txHash)}
              >
                📋 Click to copy transaction hash
              </button>
            )}

            <button className="done-button" onClick={onClose}>
              Done
            </button>
          </div>
        )}

        {/* ---------- ERROR ---------- */}
        {status === "error" && (
          <div className="message-box error">
            <span className="message-icon">✖</span>
            <h3>Registration Failed</h3>
            <p>{error}</p>

            <button
              className="retry-button"
              onClick={() => setStatus("idle")}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestRegisterModal;
