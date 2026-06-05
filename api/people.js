const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "People lookup is missing Supabase server configuration" });
    return;
  }

  try {
    const q = String(req.query.q || "").trim();
    let query = supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url")
      .order("created_at", { ascending: false })
      .limit(60);

    if (q) {
      query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.status(200).json({
      people: (data || []).map((p) => ({
        id: p.id,
        email: p.email,
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
      })),
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "People lookup failed" });
  }
};
