export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
}

export interface CardData {
  number: string;
  holder: string;
  expiry: string;
  type: string;
  balance: number;
  limit: number;
  frozen: boolean;
}