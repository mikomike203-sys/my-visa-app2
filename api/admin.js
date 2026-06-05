const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminUser = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

const supabase = createClient(supabaseUrl, serviceKey);

function authorized(body) {
  return body?.username === adminUser && body?.password === adminPassword;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!supabaseUrl || !serviceKey || !adminUser || !adminPassword) {
    res.status(500).json({ error: "Admin API is missing Supabase service configuration" });
    return;
  }

  const body = req.body || {};
  if (!authorized(body)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  try {
    if (body.action === "login" || body.action === "list") {
      const [{ data: profiles, error: profileError }, { data: transactions, error: txError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      ]);
      if (profileError) throw profileError;
      if (txError) throw txError;
      res.status(200).json({ profiles: profiles || [], transactions: transactions || [] });
      return;
    }

    if (body.action === "adjust") {
      const amount = Number(body.amount);
      if (!body.userId || !amount) throw new Error("User and non-zero amount are required");

      const { data: profile, error: getError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", body.userId)
        .single();
      if (getError) throw getError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: Number(profile.balance) + amount, updated_at: new Date().toISOString() })
        .eq("id", body.userId);
      if (updateError) throw updateError;

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: body.userId,
        card_id: null,
        type: amount > 0 ? "topup" : "withdraw",
        amount: Math.abs(amount),
        fee: 0,
        currency: profile.currency,
        description: body.reason || (amount > 0 ? "Admin credit" : "Admin debit"),
        recipient_email: null,
        recipient_name: null,
        status: "completed",
      });
      if (txError) throw txError;

      res.status(200).json({ ok: true });
      return;
    }

    if (body.action === "kyc") {
      if (!body.userId || !["verified", "rejected", "pending", "not_submitted"].includes(body.status)) {
        throw new Error("Valid user and KYC status are required");
      }
      const { error } = await supabase
        .from("profiles")
        .update({ kyc_status: body.status, updated_at: new Date().toISOString() })
        .eq("id", body.userId);
      if (error) throw error;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Admin action failed" });
  }
};
