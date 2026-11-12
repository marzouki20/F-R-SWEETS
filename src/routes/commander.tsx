import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, ShoppingBag } from "lucide-react";
import { catalogQuery, mainImage, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { PageHero } from "@/components/site/PageHero";
import { MiniCartPanel } from "@/components/site/CartSummary";
import { QuantityStepper } from "@/components/site/QuantityStepper";
import { NewBadge, useAddToCart } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";

export const Route = createFileRoute("/commander")({
  head: () => ({
    meta: [
      { title: "Commander en ligne — F&R Sweets Café Pâtisserie" },
      { name: "description", content: "Commandez vos desserts F&R Sweets en ligne : retrait sur place ou livraison, paiement à la réception." },
      { property: "og:title", content: "Commander en ligne — F&R Sweets" },
      { property: "og:description", content: "Retrait sur place ou livraison, paiement à la réception." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: CommanderPage,
});

const SECTION_ORDER = ["Spécial F&R Sweets", "Créations exclusives", "Desserts Prestige", "Sweets classique", "Boissons", "Vente à emporter"];

function OrderRow({ product }: { product: Product }) {
  const { lines, setQuantity } = useCart();
  const addToCart = useAddToCart();
  const line = lines.find((l) => l.productId === product.id);
  return (
    <li className="flex items-center gap-4 py-4">
      <Link to="/produit/$slug" params={{ slug: product.slug }} className="shrink-0">
        <ProductImage src={mainImage(product)} alt={product.name} className="h-16 w-16 rounded-xl [&_p]:hidden [&_img.rounded-full]:h-10 [&_img.rounded-full]:w-10" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/produit/$slug" params={{ slug: product.slug }} className="font-display text-xl text-plum hover:text-berry">
            {product.name}
          </Link>
          {product.is_new && <NewBadge className="px-2 py-0.5 text-[0.55rem]" />}
        </div>
        <p className="font-ui text-sm text-muted-foreground">
          {formatPrice(product.price)}
          {!product.is_available && <span className="ml-2 text-destructive">· Indisponible</span>}
        </p>
      </div>
      {line ? (
        <QuantityStepper size="sm" value={line.quantity} min={0} onChange={(v) => setQuantity(product.id, v)} label={`Quantité ${product.name}`} />
      ) : (
        <button
          type="button"
          disabled={!product.is_available}
          onClick={() => addToCart(product)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/25 text-plum transition hover:bg-plum hover:text-primary-foreground disabled:opacity-40"
          aria-label={`Ajouter ${product.name}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}

function CommanderPage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { count } = useCart();
  const sections = SECTION_ORDER.map((name) => ({
    name,
    products: catalog.products.filter((p) => (p.menu_section ?? "Autres") === name),
  }));
  const others = catalog.products.filter((p) => !SECTION_ORDER.includes(p.menu_section ?? ""));
  if (others.length) sections.push({ name: "Autres créations", products: others });

  return (
    <>
      <PageHero eyebrow="Commande en ligne" title={<>Composez votre <span className="italic text-berry">commande</span></>}>
        Choisissez vos douceurs, puis indiquez si vous préférez le retrait sur place ou la livraison. Le paiement se fait à la réception.
      </PageHero>
      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {sections.filter((s) => s.products.length).map((s) => (
            <div key={s.name} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <h2 className="font-display text-3xl">{s.name}</h2>
              <div className="gold-rule mt-4 w-16" />
              <ul className="mt-2 divide-y divide-border/70">
                {s.products.map((p) => <OrderRow key={p.id} product={p} />)}
              </ul>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-28"><MiniCartPanel /></div>
        </div>
      </section>
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream/95 p-3 backdrop-blur lg:hidden">
          <Link to="/panier" className="flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-ui text-sm text-primary-foreground">
            <ShoppingBag className="h-4 w-4" /> Voir mon panier ({count})
          </Link>
        </div>
      )}
    </>
  );
}
