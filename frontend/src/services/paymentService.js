import { ethers } from "ethers";

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

export const payForContest = async ({ contestId, priceEth }) => {
  if (!window.ethereum) {
    throw { type: "NO_WALLET" };
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await contract.signup(contestId, {
      value: ethers.parseEther(priceEth.toString()),
    });

    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      receiptHash: receipt.hash,
    };
  } catch (err) {
    // 🔴 USER REJECTED
    if (err.code === 4001) {
      throw { type: "REJECTED" };
    }

    // 🔴 INSUFFICIENT FUNDS
    if (
      err.message?.toLowerCase().includes("insufficient funds")
    ) {
      throw { type: "INSUFFICIENT_FUNDS" };
    }

    // 🔴 WRONG NETWORK
    if (
      err.message?.toLowerCase().includes("chain") ||
      err.message?.toLowerCase().includes("network")
    ) {
      throw { type: "WRONG_NETWORK" };
    }

    // 🔴 CONTRACT REVERT
    if (err.message?.toLowerCase().includes("revert")) {
      throw { type: "CONTRACT_ERROR" };
    }

    // 🔴 UNKNOWN
    throw { type: "UNKNOWN", raw: err };
  }
};
