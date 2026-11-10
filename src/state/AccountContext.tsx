import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  clearDemoAccount,
  normalizeDemoAccount,
  readDemoAccount,
  saveDemoAccount,
  type DemoAccount,
} from "./demoAccount";

export type { DemoAccount } from "./demoAccount";

type AccountContextValue = {
  account: DemoAccount | null;
  saveAccount: (next: DemoAccount) => DemoAccount;
  resetAccount: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<DemoAccount | null>(readDemoAccount);

  const saveAccount = useCallback((next: DemoAccount) => {
    const normalized = normalizeDemoAccount(next);
    saveDemoAccount(normalized);
    setAccount(normalized);
    return normalized;
  }, []);

  const resetAccount = useCallback(() => {
    clearDemoAccount();
    setAccount(null);
  }, []);

  const value = useMemo(
    () => ({ account, saveAccount, resetAccount }),
    [account, saveAccount, resetAccount],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount, AccountProvider içinde kullanılmalı");
  return ctx;
}
