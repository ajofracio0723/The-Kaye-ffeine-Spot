import { createContext, useContext, useEffect, useState } from "react";
import type { StoreSettings } from "@/lib/types";
import { formatMoney, getCurrency } from "@/lib/currency";
import { getSettings, updateSettings as saveSettings } from "@/lib/storage";

interface SettingsContextType {
  settings: StoreSettings;
  currencyCode: string;
  currencySymbol: string;
  taxRate: number;
  format: (amount: number, decimals?: number) => string;
  updateSettings: (updates: Partial<StoreSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => getSettings());

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const next = saveSettings(updates);
    setSettings(next);
  };

  const currency = getCurrency(settings.currency);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        currencyCode: currency.code,
        currencySymbol: currency.symbol,
        taxRate: settings.tax_rate,
        format: (amount, decimals = 2) => formatMoney(amount, settings.currency, decimals),
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
