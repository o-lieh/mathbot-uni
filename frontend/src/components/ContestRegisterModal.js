import React, { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext.js";
import { ethers } from "ethers";
import "../assets/scss/_modal.scss";

const CONTRACT_ADDRESS = "0x56F9c1b349fa551b57217274C02B7FC1741b4dD7";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_ID", type: "uint256" }],
    name: "signup",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

function ContestRegisterModal({ contestId, onClose }) {
  const { wallet, connectWallet } = useWallet();

  const [teamName, setTeamName] = useState("");
  const [contestPrice, setContestPrice] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [txHash, setTxHash] = useState("");

  /* ---------------- LOAD CONTEST ---------------- */
  useEffect(() => {
    const loadContest = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/contests/${contestId}/`
        );
        const data = await res.json();
        setContestPrice(Number(data.registration_price) || 0);
      } catch {
        setContestPrice(0);
      }
    };
    loadContest();
  }, [contestId]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!teamName.trim()) {
      alert("Please enter team name");
      return;
    }

    if (!wallet) {
      await connectWallet();
      return;
    }

    contestPrice === 0
      ? handleFreeRegistration()
      : handlePaidRegistration();
  };

  /* ---------------- FREE ---------------- */
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

  /* ---------------- PAID ---------------- */
  const handlePaidRegistration = async () => {
    try {
      setStatus("processing");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.signup(contestId, {
        value: ethers.parseEther(contestPrice.toString()),
      });

      setTxHash(tx.hash);
      const receipt = await tx.wait();

      setCode(`PAID-${receipt.hash.slice(2, 10).toUpperCase()}`);
      setStatus("success");
    } catch (err) {
      setError(
        err.code === 4001
          ? "Transaction rejected"
          : "Payment failed"
      );
      setStatus("error");
    }
  };

  /* ---------------- UI ---------------- */
return (
  <div
    className="modal-backdrop"
    onClick={status === "processing" ? null : onClose}
  >
    <div className="contest-modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>×</button>

      {status === "idle" && (
        <>
          <h2>Contest Registration</h2>

          <input
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button className="submit-button" onClick={handleSubmit}>
            {!wallet
              ? " Connect Wallet"
              : contestPrice === 0
              ? " Register for Free"
              : ` Pay ${contestPrice} ETH`}
          </button>
        </>
      )}

      {status === "processing" && (
        <div className="processing-state">
          <div className="loader" />
          <p>Processing...</p>
          {txHash && <small>{txHash.slice(0, 18)}...</small>}
        </div>
      )}

      {status === "success" && (
        <div className="success-state">
          <div className="success-header">
            <span className="checkmark">✅</span>
            <h3>Registration Successful!</h3>
          </div>

          {/* REGISTRATION CODE */}
          <div className="result-card">
            <h4>Your Registration Code</h4>
            <div
              className="code-block"
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Copied to clipboard!");
              }}
            >
              {code}
              <span className="copy-hint">Click to copy</span>
            </div>
          </div>

          {/* REGISTRATION CODE COPY BUTTON */}
          <button
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            📋 Copy Registration Code
          </button>

          {/* TRANSACTION HASH COPY BUTTON (PAID ONLY) */}
          {contestPrice > 0 && txHash && (
            <button
              className="copy-button secondary"
              onClick={() => navigator.clipboard.writeText(txHash)}
            >
              📋 Copy Transaction Hash
            </button>
          )}

          <button className="done-button" onClick={onClose}>
            Done
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="error-state">
          <p>{error}</p>
          <button className="wallet-btn" onClick={() => setStatus("idle")}>
            Try Again
          </button>
        </div>
      )}
    </div>
  </div>
);

}
export default ContestRegisterModal;