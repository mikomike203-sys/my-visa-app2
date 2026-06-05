const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Saved-card charge is missing server configuration" });
    return;
  }

  try {
    const { userId, paymentMethodId, amountUsd } = req.body || {};
    const amount = Number(amountUsd);
    if (!userId || !paymentMethodId || !Number.isFinite(amount) || amount < 5) {
      res.status(400).json({ error: "User, saved card, and amount above $5 are required" });
      return;
    }

    const { data: method, error: methodError } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", paymentMethodId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();
    if (methodError || !method) throw new Error("Saved card not found");

    const response = await fetch("https://api.paystack.co/transaction/charge_authorization", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: method.email,
        amount: Math.round(amount * 129 * 100),
        currency: "KES",
        authorization_code: method.authorization_code,
        metadata: { userId, paymentMethodId, amountUsd: amount, kind: "saved_card_topup" },
      }),
    });
    const data = await response.json();
    const tx = data.data;
    if (!response.ok || !data.status || tx?.status !== "success") {
      res.status(400).json({ error: data.message || "Saved-card charge failed" });
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("balance").eq("id", userId).single();
    await supabase
      .from("profiles")
      .update({ balance: Number(profile?.balance || 0) + amount, updated_at: new Date().toISOString() })
      .eq("id", userId);

    await supabase.from("transactions").insert({
      user_id: userId,
      card_id: null,
      type: "topup",
      amount,
      fee: 0,
      currency: "USD",
      description: `Saved card top up ${tx.reference}`,
      recipient_email: null,
      recipient_name: `${method.card_type || "Card"} ending ${method.last4 || "****"}`,
      status: "completed",
    });

    res.status(200).json({ ok: true, reference: tx.reference, amountUsd: amount });
  } catch (error) {
    res.status(400).json({ error: error.message || "Saved-card charge failed" });
  }
};
