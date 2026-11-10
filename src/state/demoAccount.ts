export type DemoAccount = {
  name: string;
  email: string;
  phone: string;
  deliveryNote?: string;
};

export type AccountValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

const STORAGE_KEY = "hci-yemeksepeti-demo-account-v1";

export const SAMPLE_DEMO_ACCOUNT: DemoAccount = {
  name: "Ayşe Yılmaz",
  email: "ayse.yilmaz@example.com",
  phone: "0500 123 45 67",
  deliveryNote: "Zile basmayın, kapıya bırakabilirsiniz.",
};

export function validateDemoAccount(input: DemoAccount): AccountValidationErrors {
  const errors: AccountValidationErrors = {};
  if (input.name.trim().length < 2) {
    errors.name = "Ad soyad en az 2 karakter olmalı.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Geçerli bir e-posta adresi gir.";
  }
  if (input.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Telefon numarası en az 10 rakam içermeli.";
  }
  return errors;
}

export function normalizeDemoAccount(input: DemoAccount): DemoAccount {
  const deliveryNote = input.deliveryNote?.trim();
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    ...(deliveryNote ? { deliveryNote } : {}),
  };
}

export function parseDemoAccount(raw: string | null): DemoAccount | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<DemoAccount>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.email !== "string" ||
      typeof candidate.phone !== "string"
    ) {
      return null;
    }
    if (candidate.deliveryNote !== undefined && typeof candidate.deliveryNote !== "string") {
      return null;
    }
    const normalized = normalizeDemoAccount({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      deliveryNote: candidate.deliveryNote,
    });
    const errors = validateDemoAccount(normalized);
    return Object.keys(errors).length === 0 ? normalized : null;
  } catch {
    return null;
  }
}

export function readDemoAccount(): DemoAccount | null {
  try {
    return parseDemoAccount(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveDemoAccount(account: DemoAccount): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeDemoAccount(account)));
  } catch {
    /* Browser storage can be unavailable in restricted sessions. */
  }
}

export function clearDemoAccount(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage optional */
  }
}
