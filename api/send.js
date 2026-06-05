const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Send API is missing Supabase service configuration" });
    return;
  }

  try {
    const { fromUserId, recipient, amount, description, cardId } = req.body || {};
    const value = Number(amount);
    const target = String(recipient || "").trim();

    if (!fromUserId || !target || !Number.isFinite(value) || value <= 0) {
      res.status(400).json({ error: "Sender, recipient, and valid amount are required" });
      return;
    }

    const { data: senderProfile, error: senderError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", fromUserId)
      .single();
    if (senderError || !senderProfile) throw new Error("Sender profile not found");

    const fee = value * 0.01;
    const total = value + fee;
    if (Number(senderProfile.balance) < total) {
      throw new Error("Insufficient balance including fee");
    }

    let query = supabase.from("profiles").select("*").limit(1);
    if (isUuid(target)) query = query.eq("id", target);
    else if (target.includes("@")) query = query.eq("email", target);
    else query = query.ilike("full_name", `%${target}%`);

    const { data: recipients, error: recipientError } = await query;
    const recipientProfile = recipients?.[0];
    if (recipientError || !recipientProfile) throw new Error("Recipient not found");
    if (recipientProfile.id === fromUserId) throw new Error("You cannot send to yourself");

    const now = new Date().toISOString();

    const { error: senderUpdateError } = await supabase
      .from("profiles")
      .update({ balance: Number(senderProfile.balance) - total, updated_at: now })
      .eq("id", fromUserId);
    if (senderUpdateError) throw senderUpdateError;

    const { error: recipientUpdateError } = await supabase
      .from("profiles")
      .update({ balance: Number(recipientProfile.balance) + value, updated_at: now })
      .eq("id", recipientProfile.id);
    if (recipientUpdateError) throw recipientUpdateError;

    await supabase.from("transactions").insert([
      {
        user_id: fromUserId,
        card_id: cardId || null,
        type: "send",
        amount: total,
        fee,
        currency: senderProfile.currency,
        description: description || `Sent to ${recipientProfile.full_name}`,
        recipient_email: recipientProfile.email,
        recipient_name: recipientProfile.full_name,
        status: "completed",
      },
      {
        user_id: recipientProfile.id,
        card_id: null,
        type: "receive",
        amount: value,
        fee: 0,
        currency: recipientProfile.currency,
        description: description || `Received from ${senderProfile.full_name}`,
        recipient_email: senderProfile.email,
        recipient_name: senderProfile.full_name,
        status: "completed",
      },
    ]);

    res.status(200).json({ ok: true, recipient: recipientProfile });
  } catch (error) {
    res.status(400).json({ error: error.message || "Send failed" });
  }
};
