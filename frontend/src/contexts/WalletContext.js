import React, { createContext, useContext, useState, useEffect } from "react";
console.log("ContestRegisterModal rendered");

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  // Auto-connect if user already authorized
  useEffect(() => {
    const tryConnect = async () => {
      if (typeof window === "undefined") return;

      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts && accounts.length > 0) {
          setWallet({ address: accounts[0] });
        }
      } catch (err) {
        console.error("Auto connect failed:", err);
      }
    };

    tryConnect();
  }, []);

  // Connect wallet on button click
  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      alert("MetaMask is not installed");
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setWallet({ address: accounts[0] });
      }
    } catch (err) {
      alert("Wallet connection failed");
      console.error("Wallet connect error:", err);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider
      value={{ wallet, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Hook for components
export const useWallet = () => {
  const context = useContext(WalletContext);

  if (context === null) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
};
