import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function CartTotals({ subtotal, deliveryNote = true }: { subtotal: number; deliveryNote?: boolean }) {
  return (
    <dl className="space-y-3 font-ui text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Sous-total</dt>
        <dd className="text-plum">{formatPrice(subtotal)}</dd>
      </div>
      {deliveryNote && (
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Frais de livraison</dt>
          <dd className="text-right text-muted-foreground">Communiqués lors de la confirmation</dd>
        </div>
      )}
      <div className="gold-rule my-2" />
      <div className="flex items-baseline justify-between">
        <dt className="font-medium text-plum">Total</dt>
        <dd className="font-display text-3xl text-plum">{formatPrice(subtotal)}</dd>
      </div>
    </dl>
  );
}

export function MiniCartPanel() {
  const { lines, subtotal, count } = useCart();
  return (
    <aside className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-3xl">Votre panier</h2>
      <p className="mt-1 font-ui text-xs text-muted-foreground">{count} article{count > 1 ? "s" : ""}</p>
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Ajoutez vos douceurs préférées pour commencer.</p>
      ) : (
        <ul className="mt-5 max-h-64 space-y-3 overflow-auto pr-1">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3 text-sm">
              <span className="text-foreground/85">{l.quantity} × {l.name}</span>
              <span className="shrink-0 font-ui text-plum">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <CartTotals subtotal={subtotal} />
      </div>
      <div className="mt-6 grid gap-2">
        <Button asChild disabled={lines.length === 0} size="lg">
          <Link to="/commande" disabled={lines.length === 0}>Valider ma commande</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/panier">Modifier le panier</Link>
        </Button>
      </div>
    </aside>
  );
}
