import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { buildWhatsappMessage, DELIVERY_LABEL, LAST_ORDER_KEY, PAYMENT_LABEL, type PlacedOrder } from "@/lib/orders";
import { whatsappLink } from "@/lib/site";

type ConfirmationSearch = { n?: string };

export const Route = createFileRoute("/confirmation")({
  validateSearch: (s: Record<string, unknown>): ConfirmationSearch => ({ n: typeof s.n === "string" ? s.n : undefined }),
  head: () => ({
    meta: [
      { title: "Commande enregistrée — F&R Sweets" },
      { name: "description", content: "Merci ! Votre commande F&R Sweets a bien été enregistrée." },
      { property: "og:title", content: "Commande enregistrée — F&R Sweets" },
      { property: "og:description", content: "Votre commande a bien été enregistrée." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { n } = Route.useSearch();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      if (raw) {
        const o = JSON.parse(raw) as PlacedOrder;
        if (!n || o.order_number === n) setOrder(o);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, [n]);

  const number = order?.order_number ?? n;

  return (
    <section className="bg-hero">
      <div className="container-page max-w-3xl py-16 md:py-24">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.4} />
          <p className="eyebrow mt-6">Merci pour votre commande</p>
          <h1 className="mt-4 text-5xl md:text-6xl">Commande enregistrée</h1>
          {number && (
            <p className="mt-6 inline-flex rounded-full border border-gold/50 bg-card px-6 py-2.5 font-ui text-lg tracking-wider text-plum">
              N° {number}
            </p>
          )}
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Votre commande est <strong className="text-plum">en attente</strong> : elle sera confirmée très prochainement par F&R Sweets.
            Conservez votre numéro de commande pour suivre son avancement.
          </p>
        </div>

        {ready && order && (
          <div className="mt-12 rounded-3xl border border-border bg-card p-7 shadow-float md:p-10">
            <h2 className="font-display text-3xl">Récapitulatif</h2>
            <ul className="mt-6 divide-y divide-border">
              {order.items.map((i) => (
                <li key={i.name} className="flex justify-between gap-4 py-3 text-sm">
                  <span>{i.quantity} × {i.name}</span>
                  <span className="font-ui text-plum">{formatPrice(i.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="gold-rule my-5" />
            <div className="flex items-baseline justify-between">
              <span className="font-ui text-plum">Total</span>
              <span className="font-display text-3xl text-plum">{formatPrice(order.total)}</span>
            </div>
            {order.delivery_mode === "delivery" && (
              <p className="mt-2 text-right text-xs text-muted-foreground">Frais de livraison communiqués lors de la confirmation</p>
            )}
            <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Réception</dt><dd className="mt-1">{DELIVERY_LABEL[order.delivery_mode]}</dd></div>
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Date & heure</dt><dd className="mt-1">{order.desired_date} à {order.desired_time}</dd></div>
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Paiement</dt><dd className="mt-1">{PAYMENT_LABEL[order.payment_method]}</dd></div>
              {order.address && <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Adresse</dt><dd className="mt-1">{order.address}</dd></div>}
            </dl>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {order && (
            <Button asChild size="lg">
              <a href={whatsappLink(buildWhatsappMessage(order))} target="_blank" rel="noreferrer">
                <MessageCircle /> Contacter F&R Sweets sur WhatsApp
              </a>
            </Button>
          )}
          <Button asChild size="lg" variant="gold">
            <Link to="/suivi" search={{ n: number }}>Suivre ma commande</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/carte">Retour à la carte</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
