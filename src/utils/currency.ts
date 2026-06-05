export type Currency = "USD" | "EUR" | "GBP" | "KES" | "NGN";

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  KES: 129,
  NGN: 1500,
};

export function toBaseCurrency(value: number, currency: Currency) {
  return value / (RATES[currency] || 1);
}

export function formatMoney(value: number, currency: Currency, options?: { minimumFractionDigits?: number }) {
  const amount = value * (RATES[currency] || 1);
  const minimumFractionDigits = options?.minimumFractionDigits ?? (currency === "KES" || currency === "NGN" ? 0 : 2);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "KES" ? "KES" : currency === "NGN" ? "NGN" : currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  })
    .format(amount)
    .replace("Ksh", "KSh");
}
