import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { mainImage, type Product } from "@/lib/catalog";
import { NewBadge, useAddToCart } from "./ProductCard";
import { ProductImage } from "./ProductImage";
import { Reveal } from "./Reveal";

export function ExclusiveSection({ products }: { products: Product[] }) {
  const addToCart = useAddToCart();
  if (products.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-plum-gradient py-24 text-primary-foreground">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4">Collection 2026</p>
            <h2 className="text-4xl leading-[1.05] text-cream md:text-5xl">Nos Créations Exclusives</h2>
            <div className="gold-rule mx-auto mt-6 w-24" />
            <p className="mt-6 leading-relaxed text-lavender-soft/85">
              Trois créations inédites, imaginées autour des fruits violets : intenses, délicates et résolument signature.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-cream text-foreground shadow-float">
                <Link to="/produit/$slug" params={{ slug: p.slug }} className="relative block">
                  <ProductImage src={mainImage(p)} alt={p.name} className="aspect-[4/5]" imgClassName="img-zoom group-hover:scale-105" />
                  <NewBadge className="absolute left-4 top-4" />
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[1.7rem] leading-tight">{p.name}</h3>
                    <span className="font-ui font-medium text-plum">{formatPrice(p.price)}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.short_description}</p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to="/produit/$slug" params={{ slug: p.slug }}>Découvrir</Link>
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => addToCart(p)} disabled={!p.is_available}>
                      <ShoppingBag /> Ajouter
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

