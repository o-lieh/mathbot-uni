import React, { createContext, useContext, useEffect, useState } from "react";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Auto connect (front-only) ---------- */
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) {
        setLoading(false);
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts && accounts.length > 0) {
          setWallet({ address: accounts[0] });
        }
      } catch (err) {
        console.error("Auto connect failed", err);
      } finally {
        setLoading(false);
      }
    };

    autoConnect();
  }, []);

  /* ---------- Connect wallet ---------- */
  const connectWallet = async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
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
      console.error("User rejected wallet connection", err);
    }
  };

  /* ---------- Disconnect (front-only) ---------- */
  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

/* ---------- Hook ---------- */
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};
