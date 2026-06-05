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
    res.status(500).json({ error: "Payment verification is missing server configuration" });
    return;
  }

  try {
    const { userId, reference, createVirtualCard } = req.body || {};
    if (!userId || !reference) {
      res.status(400).json({ error: "User and Paystack reference are required" });
      return;
    }

    const verify = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const verified = await verify.json();
    const tx = verified.data;
    if (!verify.ok || !verified.status || tx?.status !== "success") {
      res.status(400).json({ error: verified.message || "Paystack transaction was not successful" });
      return;
    }

    const authorization = tx.authorization || {};
    if (!authorization.authorization_code || !authorization.signature) {
      res.status(400).json({ error: "Paystack did not return a reusable card authorization" });
      return;
    }

    const { data: method, error: methodError } = await supabase
      .from("payment_methods")
      .upsert({
        user_id: userId,
        authorization_code: authorization.authorization_code,
        full_authorization: authorization,
        card_type: authorization.card_type || authorization.brand || null,
        last4: authorization.last4 || null,
        exp_month: authorization.exp_month || null,
        exp_year: authorization.exp_year || null,
        bank: authorization.bank || null,
        signature: authorization.signature,
        email: tx.customer?.email || tx.customer_email || "",
        is_active: true,
      }, { onConflict: "user_id,signature" })
      .select()
      .single();
    if (methodError) throw methodError;

    const amountUsd = Number(tx.metadata?.amountUsd || 0);
    await supabase.from("transactions").insert({
      user_id: userId,
      card_id: null,
      type: "topup",
      amount: amountUsd,
      fee: 0,
      currency: "USD",
      description: `Paystack card authorization ${reference}`,
      recipient_email: null,
      recipient_name: method ? `${method.card_type || "Card"} ending ${method.last4 || "****"}` : null,
      status: "completed",
    });

    if (amountUsd > 0) {
      const { data: profile } = await supabase.from("profiles").select("balance").eq("id", userId).single();
      await supabase
        .from("profiles")
        .update({ balance: Number(profile?.balance || 0) + amountUsd, updated_at: new Date().toISOString() })
        .eq("id", userId);
    }

    if (createVirtualCard) {
      await supabase.from("cards").insert({
        user_id: userId,
        label: `${method.card_type || "Paystack"} ${method.last4 || "Card"}`,
        card_number: `**** **** **** ${method.last4 || "0000"}`,
        card_holder: tx.customer?.email || "Visa Kenya",
        expiry: `${method.exp_month || "00"}/${method.exp_year || "00"}`,
        balance: 0,
        color: "graphite",
        frozen: false,
        is_virtual: true,
      });
    }

    res.status(200).json({ ok: true, paymentMethod: method, amountUsd });
  } catch (error) {
    res.status(400).json({ error: error.message || "Payment verification failed" });
  }
};
