import type { PaymentMethod, Service } from "../../types/domain";

export type CardValues = { holder: string; number: string; expiry: string; cvv: string };
export type CardErrors = Partial<Record<keyof CardValues, string>>;
export type PaymentStatus = "idle" | "processing" | "failed";
export type FixtureId = "presentation-card" | "retry-card";
export const EMPTY_CARD: CardValues = { holder: "", number: "", expiry: "", cvv: "" };
export const CARD_FIELDS = ["holder", "number", "expiry", "cvv"] as const;
export const TIP_AMOUNTS = [0, 30, 50, 75, 100] as const;
export const SAVED_CARD_KEY = "hci-checkout-saved-fixture-v1";

// Deliberately fictional identifiers. No gateway, card vault or bank is called.
const FIXTURES: Record<FixtureId, { number: string; label: string }> = {
  "presentation-card": { number: "0000000000000000", label: "•••• 0000" },
  "retry-card": { number: "0000000000000002", label: "•••• 0002" },
};
const FOOD_METHODS: PaymentMethod[] = ["card-demo", "cash-demo", "door-card-demo", "meal-card-demo"];
export function paymentMethods(service: Service): PaymentMethod[] {
  return service === "market" ? ["card-demo"] : [...FOOD_METHODS];
}
export function normalizePaymentMethod(value: unknown, service: Service): PaymentMethod {
  return paymentMethods(service).find(method => method === value) ?? "card-demo";
}
export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return FOOD_METHODS.some(method => method === value);
}
export function formatCardNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");
}
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
export function cardFixture(number: string): FixtureId | undefined {
  const digits = number.replace(/\s/g, "");
  return (Object.keys(FIXTURES) as FixtureId[]).find(id => FIXTURES[id].number === digits);
}
export function validateCard(card: CardValues, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  if (card.holder.trim().length < 2 || card.holder.length > 100) {
    errors.holder = "Kartın üzerindeki ad soyadı yaz.";
  }
  const number = card.number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(number)) errors.number = "16 haneli kart numarasını tamamla.";
  else if (!cardFixture(number)) errors.number = "Bu kartla devam edilemiyor. Kart numarasını kontrol et.";
  const expiry = /^(\d{2})\/(\d{2})$/.exec(card.expiry);
  if (!expiry || Number(expiry[1]) < 1 || Number(expiry[1]) > 12) {
    errors.expiry = "Son kullanma tarihini AA/YY biçiminde yaz.";
  } else {
    const month = Number(expiry[1]);
    const year = 2000 + Number(expiry[2]);
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiry = "Kartın son kullanma tarihi geçmiş. Tarihi kontrol et.";
    }
  }
  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = "3 veya 4 haneli güvenlik kodunu gir.";
  return errors;
}

type FixtureStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function readSavedFixture(storage: FixtureStorage | undefined): FixtureId | undefined {
  try {
    const value: unknown = JSON.parse(storage?.getItem(SAVED_CARD_KEY) ?? "null");
    if (!value || typeof value !== "object") return undefined;
    const id = (value as { fixtureId?: unknown }).fixtureId;
    return id === "presentation-card" || id === "retry-card" ? id : undefined;
  } catch { return undefined; }
}
export function saveFixture(storage: FixtureStorage | undefined, fixtureId: FixtureId): boolean {
  try {
    if (!storage) return false;
    storage.setItem(SAVED_CARD_KEY, JSON.stringify({ fixtureId }));
    return true;
  } catch { return false; }
}
export function forgetFixture(storage: FixtureStorage | undefined): boolean {
  try {
    if (!storage) return false;
    storage.removeItem(SAVED_CARD_KEY);
    return true;
  } catch { return false; }
}
export const fixtureLabel = (id: FixtureId) => FIXTURES[id].label;
export function fixtureCard(id: FixtureId): CardValues {
  return { holder: "Deniz Yılmaz", number: formatCardNumber(FIXTURES[id].number), expiry: "12/30", cvv: "" };
}

type AttemptResult = { status: "succeeded" | "failed" | "cancelled" | "busy" };
type AttemptRequest = { method: PaymentMethod; fixtureId?: FixtureId };
function waitForLocalResult(delayMs: number, signal: AbortSignal): Promise<boolean> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(false); return; }
    const cancel = () => { clearTimeout(timer); resolve(false); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancel); resolve(true); }, delayMs);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

// One in-flight attempt per checkout. Cancellation never creates an order.
export function createPaymentRunner(delayMs = 1200) {
  let active: AbortController | undefined;
  let retryCardFailed = false;
  return {
    pending: () => !!active,
    cancel: () => { active?.abort(); active = undefined; },
    async run(request: AttemptRequest): Promise<AttemptResult> {
      if (active) return { status: "busy" };
      const controller = new AbortController();
      active = controller;
      try {
        if (!await waitForLocalResult(delayMs, controller.signal)) return { status: "cancelled" };
        if (request.method === "card-demo") {
          if (!request.fixtureId) return { status: "failed" };
          if (request.fixtureId === "retry-card" && !retryCardFailed) {
            retryCardFailed = true;
            return { status: "failed" };
          }
        }
        return { status: "succeeded" };
      } finally {
        if (active === controller) active = undefined;
      }
    },
  };
}
