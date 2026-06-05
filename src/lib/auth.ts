import { supabase } from "./supabase";
import type { Profile, Card, Transaction } from "../types/database";

// Generate a unique card number using parts of userId + random
function generateCardNumber(userId: string): string {
  const prefix = "4";
  const hash = userId.replace(/-/g, "").slice(0, 6).toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const mid = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}${hash.slice(0, 3)} ${random} ${mid} ${hash.slice(3, 6)}`;
}

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError && !/confirm|verified/i.test(signInError.message)) {
      throw signInError;
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const baseUrl = window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: baseUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Card functions
export async function getUserCards(userId: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCard(userId: string, card: Omit<Card, "id" | "created_at" | "updated_at" | "user_id">) {
  const uniqueCardNumber = generateCardNumber(userId);
  const { data, error } = await supabase
    .from("cards")
    .insert({ ...card, user_id: userId, card_number: uniqueCardNumber })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCard(cardId: string, updates: Partial<Card>) {
  const { data, error } = await supabase
    .from("cards")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", cardId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCard(cardId: string) {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId);
  if (error) throw error;
}

// Transaction functions
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const txns = data || [];
  const emails = Array.from(new Set(txns.map((t) => t.recipient_email).filter(Boolean))) as string[];
  if (emails.length === 0) return txns;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("email, avatar_url")
    .in("email", emails);
  const avatarByEmail = new Map((profiles || []).map((p) => [p.email, p.avatar_url]));

  return txns.map((txn) => ({
    ...txn,
    recipient_avatar_url: txn.recipient_email ? avatarByEmail.get(txn.recipient_email) || null : null,
  }));
}

export async function createTransaction(transaction: Omit<Transaction, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function sendMoney(
  fromUserId: string,
  toEmail: string,
  amount: number,
  description?: string,
  cardId?: string
) {
  const res = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromUserId, recipient: toEmail, amount, description, cardId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Send failed");
  return data;
}

// Admin functions
export async function getAdminUser(username: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .single();
  if (error) return null;
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminAdjustBalance(userId: string, amount: number) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error("User not found");

  await updateProfile(userId, { balance: profile.balance + amount });

  await createTransaction({
    user_id: userId,
    card_id: null,
    type: amount > 0 ? "topup" : "withdraw",
    amount: Math.abs(amount),
    fee: 0,
    currency: profile.currency,
    description: amount > 0 ? "Admin credit" : "Admin debit",
    recipient_email: null,
    recipient_name: null,
    status: "completed",
  });
}

export async function submitKyc(userId: string, documentUrl: string) {
  return updateProfile(userId, {
    kyc_status: "pending",
    kyc_document_url: documentUrl,
  });
}

export async function topUpBalance(userId: string, amount: number, reference: string) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error("User not found");

  await updateProfile(userId, { balance: profile.balance + amount });

  await createTransaction({
    user_id: userId,
    card_id: null,
    type: "topup",
    amount,
    fee: 0,
    currency: profile.currency,
    description: `Paystack top up ${reference}`,
    recipient_email: null,
    recipient_name: null,
    status: "completed",
  });
}
