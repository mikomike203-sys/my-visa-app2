export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      cards: {
        Row: Card;
        Insert: Omit<Card, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Card, "id">>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at">;
        Update: Partial<Omit<Transaction, "id">>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "id" | "created_at">;
        Update: Partial<Omit<AdminUser, "id">>;
      };
    };
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  balance: number;
  currency: string;
  kyc_status: "pending" | "verified" | "rejected" | "not_submitted";
  kyc_document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  label: string;
  card_number: string;
  card_holder: string;
  expiry: string;
  balance: number;
  color: string;
  frozen: boolean;
  is_virtual: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  card_id: string | null;
  type: "send" | "receive" | "topup" | "withdraw" | "payment";
  amount: number;
  fee: number;
  currency: string;
  description: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  status: "pending" | "completed" | "failed" | "reversed";
  created_at: string;
  recipient_avatar_url?: string | null;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface PublicPerson {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}
