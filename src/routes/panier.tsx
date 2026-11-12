import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useHydrated } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { QuantityStepper } from "@/components/site/QuantityStepper";
import { ProductImage } from "@/components/site/ProductImage";
import { CartTotals } from "@/components/site/CartSummary";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier — F&R Sweets" },
      { name: "description", content: "Retrouvez les douceurs ajoutées à votre panier F&R Sweets et finalisez votre commande." },
      { property: "og:title", content: "Votre panier — F&R Sweets" },
      { property: "og:description", content: "Finalisez votre commande de pâtisseries F&R Sweets." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const { lines, subtotal, setQuantity, remove } = useCart();
  const hydrated = useHydrated();

  return (
    <>
      <PageHero eyebrow="Panier" title="Votre panier" />
      <section className="container-page py-14">
        {!hydrated ? (
          <div className="h-64 animate-pulse rounded-3xl bg-lavender-mist" />
        ) : lines.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-lavender bg-lavender-mist/50 p-14 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-lavender" />
            <p className="mt-5 font-display text-3xl text-plum">Votre panier est vide</p>
            <p className="mt-3 text-muted-foreground">Laissez-vous tenter par nos créations à la myrtille.</p>
            <Button asChild className="mt-8"><Link to="/carte">Découvrir la carte</Link></Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <ul className="divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-soft md:px-8">
              {lines.map((l) => (
                <li key={l.productId} className="flex flex-wrap items-center gap-4 py-6 sm:flex-nowrap">
                  <Link to="/produit/$slug" params={{ slug: l.slug }} className="shrink-0">
                    <ProductImage src={l.image} alt={l.name} className="h-24 w-24 rounded-2xl [&_p]:hidden [&_img.rounded-full]:h-12 [&_img.rounded-full]:w-12" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to="/produit/$slug" params={{ slug: l.slug }} className="font-display text-2xl text-plum hover:text-berry">{l.name}</Link>
                    <p className="font-ui text-sm text-muted-foreground">Prix unitaire : {formatPrice(l.price)}</p>
                  </div>
                  <QuantityStepper size="sm" value={l.quantity} min={1} onChange={(v) => setQuantity(l.productId, v)} label={`Quantité ${l.name}`} />
                  <p className="w-24 text-right font-ui font-medium text-plum">{formatPrice(l.price * l.quantity)}</p>
                  <button type="button" onClick={() => remove(l.productId)} className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Supprimer ${l.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-3xl border border-border bg-card p-7 shadow-soft lg:sticky lg:top-28">
              <h2 className="font-display text-3xl">Récapitulatif</h2>
              <div className="mt-6"><CartTotals subtotal={subtotal} /></div>
              <Button asChild size="lg" className="mt-7 w-full"><Link to="/commande">Valider ma commande</Link></Button>
              <Button asChild variant="ghost" size="sm" className="mt-2 w-full"><Link to="/carte">Continuer mes achats</Link></Button>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
