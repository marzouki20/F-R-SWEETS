import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/PageHero";
import { formatDate, formatPrice } from "@/lib/format";
import { DELIVERY_LABEL, STATUS_LABEL, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

type SuiviSearch = { n?: string };

export const Route = createFileRoute("/suivi")({
  validateSearch: (s: Record<string, unknown>): SuiviSearch => ({ n: typeof s.n === "string" ? s.n : undefined }),
  head: () => ({
    meta: [
      { title: "Suivre ma commande — F&R Sweets" },
      { name: "description", content: "Consultez le statut de votre commande F&R Sweets avec votre numéro de commande et votre téléphone." },
      { property: "og:title", content: "Suivre ma commande — F&R Sweets" },
      { property: "og:description", content: "Le statut de votre commande en un instant." },
    ],
  }),
  component: SuiviPage,
});

type Tracked = {
  order_number: string;
  status: OrderStatus;
  delivery_mode: "pickup" | "delivery";
  desired_date: string;
  desired_time: string;
  total: number;
  created_at: string;
  items: { name: string; quantity: number; line_total: number }[];
};

function steps(mode: Tracked["delivery_mode"]): OrderStatus[] {
  return mode === "delivery"
    ? ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed"]
    : ["pending", "confirmed", "preparing", "ready", "completed"];
}

function SuiviPage() {
  const { n } = Route.useSearch();
  const [number, setNumber] = useState(n ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Tracked | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    const { data } = await supabase.rpc("track_order", { _order_number: number.trim(), _phone: phone });
    setLoading(false);
    if (!data) {
      setResult(null);
      setNotFound(true);
      return;
    }
    setResult(data as unknown as Tracked);
  }

  const list = result ? steps(result.delivery_mode) : [];
  const current = result ? list.indexOf(result.status) : -1;

  return (
    <>
      <PageHero eyebrow="Suivi" title={<>Suivre ma <span className="italic text-berry">commande</span></>}>
        Saisissez votre numéro de commande et le téléphone utilisé lors de la commande.
      </PageHero>
      <section className="container-page max-w-3xl py-14">
        <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-[1fr_1fr_auto] md:items-end md:p-8">
          <div>
            <Label htmlFor="num">Numéro de commande</Label>
            <Input id="num" required placeholder="FR-261112-XXXXX" className="mt-2 uppercase" value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tel">Téléphone</Label>
            <Input id="tel" required type="tel" inputMode="tel" className="mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />} Rechercher
          </Button>
        </form>

        {notFound && (
          <p className="mt-8 rounded-2xl border border-lavender bg-lavender-mist p-5 text-center text-plum" role="alert">
            Aucune commande ne correspond à ces informations. Vérifiez le numéro et le téléphone.
          </p>
        )}

        {result && (
          <div className="mt-10 animate-page-in rounded-3xl border border-border bg-card p-7 shadow-float md:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl">Commande {result.order_number}</h2>
              <span className="font-ui text-sm text-muted-foreground">passée le {formatDate(result.created_at)}</span>
            </div>
            {result.status === "cancelled" ? (
              <p className="mt-6 rounded-2xl bg-destructive/10 p-5 text-destructive">Cette commande a été annulée. Contactez-nous pour plus d'informations.</p>
            ) : (
              <ol className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {list.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 sm:flex-col sm:text-center">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-ui text-sm",
                        i < current && "border-plum bg-plum text-primary-foreground",
                        i === current && "border-gold bg-gold text-primary-foreground shadow-glow",
                        i > current && "border-border text-muted-foreground",
                      )}
                    >
                      {i < current ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={cn("font-ui text-xs", i === current ? "font-medium text-plum" : "text-muted-foreground")}>{STATUS_LABEL[s]}</span>
                  </li>
                ))}
              </ol>
            )}
            <dl className="mt-8 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Réception</dt><dd className="mt-1">{DELIVERY_LABEL[result.delivery_mode]}</dd></div>
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Prévue le</dt><dd className="mt-1">{result.desired_date} à {result.desired_time}</dd></div>
              <div><dt className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Total</dt><dd className="mt-1">{formatPrice(result.total)}</dd></div>
            </dl>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {result.items.map((i) => <li key={i.name}>{i.quantity} × {i.name}</li>)}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
