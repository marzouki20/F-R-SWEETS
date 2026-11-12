import { formatPrice } from "./format";
import { SITE } from "./site";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  out_for_delivery: "En livraison",
  completed: "Terminée",
  cancelled: "Annulée",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-plum border-gold/40",
  confirmed: "bg-lavender-soft text-plum border-lavender",
  preparing: "bg-lavender/40 text-plum border-lavender",
  ready: "bg-success/15 text-plum border-success/40",
  out_for_delivery: "bg-berry/10 text-berry border-berry/30",
  completed: "bg-plum text-primary-foreground border-plum",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export const DELIVERY_LABEL = { pickup: "Retrait sur place", delivery: "Livraison" } as const;
export const PAYMENT_LABEL = {
  cash_on_delivery: "Paiement à la livraison",
  pay_at_pickup: "Paiement lors du retrait en magasin",
} as const;

export type PlacedOrder = {
  order_number: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: { name: string; unit_price: number; quantity: number; line_total: number }[];
  customer_name: string;
  delivery_mode: keyof typeof DELIVERY_LABEL;
  payment_method: keyof typeof PAYMENT_LABEL;
  desired_date: string;
  desired_time: string;
  address?: string | null;
};

export function buildWhatsappMessage(order: PlacedOrder): string {
  const lines = order.items.map((i) => `• ${i.quantity} × ${i.name} — ${formatPrice(i.line_total)}`);
  return [
    `Bonjour ${SITE.shortName} !`,
    `Je viens de passer la commande n° ${order.order_number}.`,
    "",
    ...lines,
    "",
    `Total : ${formatPrice(order.total)}`,
    `${DELIVERY_LABEL[order.delivery_mode]} le ${order.desired_date} à ${order.desired_time}`,
    order.address ? `Adresse : ${order.address}` : null,
    `Nom : ${order.customer_name}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export const LAST_ORDER_KEY = "fr-sweets-last-order";
