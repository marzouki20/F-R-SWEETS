export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

export const MAX_QTY = 99;

export function addLine(lines: CartLine[], item: Omit<CartLine, "quantity">, qty = 1): CartLine[] {
  const existing = lines.find((l) => l.productId === item.productId);
  if (existing) {
    return lines.map((l) =>
      l.productId === item.productId ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) } : l,
    );
  }
  return [...lines, { ...item, quantity: Math.min(MAX_QTY, Math.max(1, qty)) }];
}

export function setLineQuantity(lines: CartLine[], productId: string, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => l.productId !== productId);
  return lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(MAX_QTY, qty) } : l));
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return Math.round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0) * 100) / 100;
}

export type DeliveryMode = "pickup" | "delivery";
export type PaymentMethod = "cash_on_delivery" | "pay_at_pickup";

/** Payment follows the reception mode: cash on delivery, or pay when collecting in store. */
export function paymentFor(mode: DeliveryMode): PaymentMethod {
  return mode === "delivery" ? "cash_on_delivery" : "pay_at_pickup";
}
