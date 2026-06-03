export type Currency = "USD" | "KSH";

const KSH_RATE = 129;

export function formatMoney(value: number, currency: Currency, options?: { minimumFractionDigits?: number }) {
  const amount = currency === "KSH" ? value * KSH_RATE : value;
  const minimumFractionDigits = options?.minimumFractionDigits ?? (currency === "KSH" ? 0 : 2);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "KSH" ? "KES" : "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  })
    .format(amount)
    .replace("Ksh", "KSh");
}
