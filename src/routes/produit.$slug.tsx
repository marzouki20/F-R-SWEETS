import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Info, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { catalogQuery, categoryOf, type Product } from "@/lib/catalog";
import { usableProductImages } from "@/lib/product-images";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AvailabilityDot, NewBadge, ProductCard, useAddToCart } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { QuantityStepper } from "@/components/site/QuantityStepper";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ context, params }) => {
    const catalog = await context.queryClient.ensureQueryData(catalogQuery);
    const product = catalog.products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { name: product.name, description: product.short_description ?? product.description ?? "" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Création introuvable — F&R Sweets" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — F&R Sweets Café Pâtisserie`;
    const description = loaderData.description || `${loaderData.name}, une création F&R Sweets à commander en ligne.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-5xl">Création introuvable</h1>
      <p className="mt-4 text-muted-foreground">Ce dessert n'est plus à la carte.</p>
      <Link to="/carte" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-ui text-sm text-primary-foreground">Voir la carte</Link>
    </div>
  ),
  component: ProductPage,
});

function isBlueberry(p: Product) {
  return /myrtille/i.test(p.name) && !/sans myrtille/i.test(p.composition ?? "");
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const product = catalog.products.find((p) => p.slug === slug)!;
  const category = categoryOf(catalog, product);
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const images = usableProductImages(product);
  const berry = isBlueberry(product);

  const similar = catalog.products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);
  const suggestions = catalog.products
    .filter((p) => p.id !== product.id && (p.is_new || p.is_exclusive) && !similar.some((s) => s.id === p.id))
    .slice(0, 4);

  return (
    <>
      <section className={cn("relative", berry ? "bg-hero" : "bg-lavender-fade")}>
        <div className="container-page pb-16 pt-8">
          <Link to="/carte" className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-plum">
            <ArrowLeft className="h-4 w-4" /> Retour à la carte
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="relative overflow-hidden rounded-[2rem] shadow-float">
                <ProductImage src={images[active] ?? null} alt={product.name} className="aspect-[4/5] md:aspect-square" eager />
                {product.is_new && <NewBadge className="absolute left-5 top-5" />}
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn("h-20 w-20 overflow-hidden rounded-xl border-2 transition", active === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100")}
                      aria-label={`Voir la photo ${i + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="eyebrow">{product.is_exclusive ? "Création exclusive" : category?.name ?? "F&R Sweets"}</p>
              <h1 className="mt-4 text-5xl leading-[1.02] md:text-6xl">{product.name}</h1>
              {product.range_label && !product.is_exclusive && (
                <p className="mt-3 font-ui text-sm text-muted-foreground">Gamme {product.range_label} · {product.menu_section}</p>
              )}
              <p className="mt-6 font-display text-4xl text-plum">{formatPrice(product.price)}</p>
              <div className="mt-3"><AvailabilityDot available={product.is_available} /></div>

              {(product.description || product.short_description) && (
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{product.description ?? product.short_description}</p>
              )}

              {product.composition && (
                <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
                  <p className="font-ui text-xs uppercase tracking-[0.22em] text-gold">Composition</p>
                  <p className="mt-3 leading-relaxed text-foreground/85">{product.composition}</p>
                </div>
              )}

              {product.special_note && (
                <div className="mt-4 flex gap-3 rounded-2xl border border-lavender bg-lavender-soft/50 p-5 text-sm leading-relaxed text-plum">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-berry" />
                  <p>{product.special_note}</p>
                </div>
              )}

              {berry && (
                <p className="mt-6 flex items-center gap-2 font-ui text-sm text-berry">
                  <Sparkles className="h-4 w-4 text-gold" /> Une création à la myrtille, couleur 100 % naturelle.
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <QuantityStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(99, v)))} />
                <Button size="lg" onClick={() => { addToCart(product, qty); setQty(1); }} disabled={!product.is_available}>
                  <ShoppingBag /> Ajouter au panier · {formatPrice(product.price * qty)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading eyebrow="Dans la même famille" title="Produits similaires" />
          <div className="mt-12 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="bg-lavender-mist py-20">
          <div className="container-page">
            <SectionHeading eyebrow="À découvrir aussi" title="Suggestions gourmandes" />
            <div className="mt-12 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
