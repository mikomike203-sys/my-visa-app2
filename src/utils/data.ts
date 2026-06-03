import { Transaction, CardData } from "../types";

export const cardData: CardData = {
  number: "4829 •••• •••• 7210",
  holder: "ALEXANDER CHEN",
  expiry: "09/28",
  type: "VISA",
  balance: 12847.50,
  limit: 25000,
  frozen: false,
};

export const transactions: Transaction[] = [
  {
    id: "1",
    merchant: "Apple Store",
    category: "Electronics",
    amount: -1299.0,
    date: "Today",
    icon: "laptop",
  },
  {
    id: "2",
    merchant: "Uber Ride",
    category: "Transport",
    amount: -24.5,
    date: "Today",
    icon: "car",
  },
  {
    id: "3",
    merchant: "Salary Deposit",
    category: "Income",
    amount: 8500.0,
    date: "Yesterday",
    icon: "bank",
  },
  {
    id: "4",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -15.99,
    date: "Yesterday",
    icon: "play",
  },
  {
    id: "5",
    merchant: "Whole Foods",
    category: "Groceries",
    amount: -187.32,
    date: "Dec 18",
    icon: "cart",
  },
  {
    id: "6",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    date: "Dec 17",
    icon: "package",
  },
  {
    id: "7",
    merchant: "Starbucks",
    category: "Food & Drink",
    amount: -6.75,
    date: "Dec 17",
    icon: "coffee",
  },
  {
    id: "8",
    merchant: "Freelance Payment",
    category: "Income",
    amount: 2400.0,
    date: "Dec 16",
    icon: "bank",
  },
];