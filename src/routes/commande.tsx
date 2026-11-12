import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useHydrated } from "@tanstack/react-router";
import { Loader2, MapPin, ShieldCheck, Store, Truck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { paymentFor, type DeliveryMode } from "@/lib/cart-logic";
import { formatPrice } from "@/lib/format";
import { LAST_ORDER_KEY, PAYMENT_LABEL, type PlacedOrder } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageHero";
import { CartTotals } from "@/components/site/CartSummary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Validation de commande — F&R Sweets" },
      { name: "description", content: "Finalisez votre commande F&R Sweets : coordonnées, mode de réception, date et heure souhaitées." },
      { property: "og:title", content: "Validation de commande — F&R Sweets" },
      { property: "og:description", content: "Coordonnées, mode de réception et récapitulatif de votre commande." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const schema = z
  .object({
    customer_name: z.string().trim().min(2, "Indiquez votre nom et prénom").max(120),
    phone: z.string().trim().refine((v) => v.replace(/\D/g, "").length >= 8 && v.replace(/\D/g, "").length <= 15, "Numéro de téléphone invalide"),
    delivery_mode: z.enum(["pickup", "delivery"]),
    address: z.string().trim().max(300).optional(),
    desired_date: z.string().min(1, "Choisissez une date"),
    desired_time: z.string().min(1, "Choisissez une heure"),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.delivery_mode === "pickup" || (v.address && v.address.length >= 5), {
    path: ["address"],
    message: "Indiquez l'adresse de livraison",
  })
  .refine((v) => v.desired_date >= todayISO(), { path: ["desired_date"], message: "La date doit être aujourd'hui ou plus tard" });

type FormState = {
  customer_name: string;
  phone: string;
  delivery_mode: DeliveryMode;
  address: string;
  desired_date: string;
  desired_time: string;
  notes: string;
};

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    customer_name: "",
    phone: "",
    delivery_mode: "pickup",
    address: "",
    desired_date: "",
    desired_time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const payment = paymentFor(form.delivery_mode);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { data, error } = await supabase.rpc("place_order", {
      _customer_name: form.customer_name,
      _phone: form.phone,
      _delivery_mode: form.delivery_mode,
      _address: form.delivery_mode === "delivery" ? form.address : "",
      _desired_date: form.desired_date,
      _desired_time: form.desired_time,
      _notes: form.notes,
      _payment_method: payment,
      _items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
    });
    setSubmitting(false);
    if (error || !data) {
      setServerError(error?.message ?? "La commande n'a pas pu être enregistrée. Veuillez réessayer.");
      return;
    }
    const result = data as unknown as Omit<PlacedOrder, "customer_name" | "delivery_mode" | "payment_method" | "desired_date" | "desired_time" | "address">;
    const order: PlacedOrder = {
      ...result,
      customer_name: form.customer_name,
      delivery_mode: form.delivery_mode,
      payment_method: payment,
      desired_date: form.desired_date,
      desired_time: form.desired_time,
      address: form.delivery_mode === "delivery" ? form.address : null,
    };
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    clear();
    navigate({ to: "/confirmation", search: { n: order.order_number } });
  }

  if (hydrated && lines.length === 0) {
    return (
      <>
        <PageHero eyebrow="Commande" title="Votre panier est vide" />
        <div className="container-page py-14 text-center">
          <Button asChild><Link to="/carte">Découvrir la carte</Link></Button>
        </div>
      </>
    );
  }

  const field = (name: keyof FormState) => errors[name] && <p className="mt-1.5 text-xs text-destructive">{errors[name]}</p>;

  return (
    <>
      <PageHero eyebrow="Validation" title={<>Finaliser ma <span className="italic text-berry">commande</span></>} />
      <form onSubmit={onSubmit} noValidate className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <legend className="sr-only">Vos coordonnées</legend>
            <h2 className="font-display text-3xl">Vos coordonnées</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom et prénom</Label>
                <Input id="name" autoComplete="name" className="mt-2" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} aria-invalid={!!errors.customer_name} />
                {field("customer_name")}
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="ex. 29 999 369" className="mt-2" value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} />
                {field("phone")}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <legend className="sr-only">Mode de réception</legend>
            <h2 className="font-display text-3xl">Mode de réception</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2" role="radiogroup">
              {([
                { value: "pickup", icon: Store, title: "Retrait sur place", text: "À la boutique, Ez Zahra" },
                { value: "delivery", icon: Truck, title: "Livraison", text: "Frais communiqués à la confirmation" },
              ] as const).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={form.delivery_mode === o.value}
                  onClick={() => set("delivery_mode", o.value)}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all",
                    form.delivery_mode === o.value ? "border-plum bg-lavender-mist shadow-soft" : "border-border hover:border-lavender",
                  )}
                >
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", form.delivery_mode === o.value ? "bg-plum text-primary-foreground" : "bg-lavender-soft text-plum")}>
                    <o.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-xl text-plum">{o.title}</span>
                    <span className="text-sm text-muted-foreground">{o.text}</span>
                  </span>
                </button>
              ))}
            </div>
            {form.delivery_mode === "delivery" && (
              <div className="mt-5 animate-page-in">
                <Label htmlFor="address" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" /> Adresse de livraison</Label>
                <Textarea id="address" autoComplete="street-address" className="mt-2 min-h-[80px]" value={form.address} onChange={(e) => set("address", e.target.value)} aria-invalid={!!errors.address} />
                {field("address")}
              </div>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Date souhaitée</Label>
                <Input id="date" type="date" min={hydrated ? todayISO() : undefined} className="mt-2" value={form.desired_date} onChange={(e) => set("desired_date", e.target.value)} aria-invalid={!!errors.desired_date} />
                {field("desired_date")}
              </div>
              <div>
                <Label htmlFor="time">Heure souhaitée</Label>
                <Input id="time" type="time" className="mt-2" value={form.desired_time} onChange={(e) => set("desired_time", e.target.value)} aria-invalid={!!errors.desired_time} />
                {field("desired_time")}
              </div>
            </div>
            <div className="mt-5">
              <Label htmlFor="notes">Instructions particulières <span className="text-muted-foreground">(facultatif)</span></Label>
              <Textarea id="notes" className="mt-2" placeholder="Message sur un gâteau, allergie à signaler, digicode…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <legend className="sr-only">Paiement</legend>
            <h2 className="font-display text-3xl">Paiement</h2>
            <div className="mt-5 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-display text-xl text-plum">{PAYMENT_LABEL[payment]}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aucun paiement en ligne : vous réglez {form.delivery_mode === "delivery" ? "au livreur à la réception" : "en boutique au moment du retrait"}.
                </p>
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-7 shadow-soft lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Récapitulatif</h2>
          <ul className="mt-5 space-y-3">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-3 text-sm">
                <span>{l.quantity} × {l.name}</span>
                <span className="shrink-0 font-ui text-plum">{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6"><CartTotals subtotal={subtotal} deliveryNote={form.delivery_mode === "delivery"} /></div>
          {serverError && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive" role="alert">{serverError}</p>}
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting || !hydrated}>
            {submitting ? <><Loader2 className="animate-spin" /> Envoi en cours…</> : "Confirmer ma commande"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Votre commande sera confirmée par F&R Sweets. En validant, vous acceptez nos{" "}
            <Link to="/conditions" className="underline underline-offset-2">conditions de vente</Link>.
          </p>
        </aside>
      </form>
    </>
  );
}
