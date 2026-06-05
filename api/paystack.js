module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: "Paystack secret key is missing" });
    return;
  }

  try {
    const { email, amountUsd, callbackUrl, metadata } = req.body || {};
    const usd = Number(amountUsd);
    if (!email || !Number.isFinite(usd) || usd < 5) {
      res.status(400).json({ error: "Valid email and amount above $5 are required" });
      return;
    }

    const kesAmount = Math.round(usd * 129 * 100);
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: kesAmount,
        currency: "KES",
        callback_url: callbackUrl,
        metadata: {
          amountUsd: usd,
          ...(metadata || {}),
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
      res.status(400).json({ error: data.message || "Could not start Paystack transaction" });
      return;
    }

    res.status(200).json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Paystack initialization failed" });
  }
};
