import type { CartLine, Carts, Product, Service } from "../types/domain";
export type RemovedLine = CartLine & { service: Service; index: number };
export type PendingRemoval = { token: number; entries: RemovedLine[] };
export type CartState = { carts: Carts; pending: PendingRemoval | null };
export type CartAction =
  | { type: "add"; product: Product }
  | { type: "change"; service: Service; id: string; delta: number; token: number }
  | { type: "remove-all"; service: Service; token: number }
  | { type: "clear"; services: Service[] }
  | { type: "undo" }
  | { type: "dismiss"; token?: number };

function withoutServices(pending: PendingRemoval | null, services: Service[]): PendingRemoval | null {
  const entries = pending?.entries.filter(line => !services.includes(line.service)) ?? [];
  return pending && entries.length ? { ...pending, entries } : null;
}
export function cartReducer(state: CartState, action: CartAction): CartState {
  const { carts, pending } = state;
  if (action.type === "dismiss") return action.token !== undefined && action.token !== pending?.token ? state : { ...state, pending: null };
  if (action.type === "clear") return {
    carts: { ...carts, ...Object.fromEntries(action.services.map(service => [service, []])) },
    pending: withoutServices(pending, action.services),
  };
  if (action.type === "add") {
    const product = action.product;
    const switched = carts[product.service].some(line => line.product.storeId !== product.storeId);
    const lines = switched ? [] : carts[product.service];
    const found = lines.find(line => line.product.id === product.id);
    return {
      carts: { ...carts, [product.service]: found
        ? lines.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...lines, { product, quantity: 1 }] },
      pending: (() => {
        if (switched) return withoutServices(pending, [product.service]);
        const entries = pending?.entries.filter(line => line.service !== product.service || line.product.storeId === product.storeId) ?? [];
        return pending && entries.length ? { ...pending, entries } : null;
      })(),
    };
  }
  if (action.type === "undo") {
    const restored: Carts = { food: [...carts.food], market: [...carts.market] };
    // Reverse removal order to put adjacent deleted lines back in their original order.
    for (const line of [...(pending?.entries ?? [])].reverse()) {
      const lines = restored[line.service];
      if (lines.some(item => item.product.storeId !== line.product.storeId)) continue;
      const found = lines.findIndex(item => item.product.id === line.product.id);
      if (found >= 0) lines[found] = { ...lines[found], quantity: lines[found].quantity + line.quantity };
      else lines.splice(Math.min(line.index, lines.length), 0, { product: line.product, quantity: line.quantity });
    }
    return { carts: restored, pending: null };
  }
  const lines = carts[action.service];
  const index = action.type === "change" ? lines.findIndex(line => line.product.id === action.id) : -1;
  if (action.type === "change" && (index < 0 || !Number.isInteger(action.delta))) return state;
  const removed = action.type === "remove-all" ? lines.map((line, index) => ({ ...line, service: action.service, index })).reverse()
    : lines[index].quantity + action.delta <= 0 ? [{ ...lines[index], service: action.service, index }] : [];
  const next = action.type === "remove-all" ? [] : lines
    .map(line => line.product.id === action.id ? { ...line, quantity: line.quantity + action.delta } : line)
    .filter(line => line.quantity > 0);
  return {
    carts: { ...carts, [action.service]: next },
    // Rapid deletions are grouped into one undo rather than replacing earlier removals.
    pending: removed.length ? { token: action.token, entries: [...(pending?.entries ?? []), ...removed] } : pending,
  };
}
