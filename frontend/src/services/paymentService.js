export const payWithWallet = async ({
  contestId,
  teamName,
  wallet
}) => {
  if (wallet.balance < 50000) {
    throw new Error("موجودی کیف پول کافی نیست");
  }

  const payload = {
    contestId,
    teamName,
    timestamp: Date.now()
  };

  const signature = await window.mathbatWallet.sign(payload);

  const response = await fetch("/api/contest/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payload,
      signature,
      address: wallet.address
    })
  });

  if (!response.ok) {
    throw new Error("پرداخت ناموفق بود");
  }
};
