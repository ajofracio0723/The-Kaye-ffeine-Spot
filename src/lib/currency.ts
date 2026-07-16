export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
];

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount: number, currencyCode: string, decimals = 2): string {
  const { symbol } = getCurrency(currencyCode);
  const value = Number.isFinite(amount) ? amount : 0;
  if (currencyCode === "JPY" || currencyCode === "KRW") {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(decimals)}`;
}
