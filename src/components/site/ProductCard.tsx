import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { mainImage, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold/60 bg-card/90 px-3 py-1 font-ui text-[0.62rem] font-medium uppercase tracking-[0.22em] text-plum backdrop-blur",
        className,
      )}
    >
      Nouveauté
    </span>
  );
}

export function AvailabilityDot({ available }: { available: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-ui text-[0.7rem] text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", available ? "bg-success" : "bg-destructive/70")} />
      {available ? "Disponible" : "Indisponible"}
    </span>
  );
}

export function useAddToCart() {
  const { add } = useCart();
  return (p: Product, qty = 1) =>
    add({ productId: p.id, slug: p.slug, name: p.name, price: p.price, image: mainImage(p) }, qty);
}

export function ProductCard({ product, className, variant = "default" }: { product: Product; className?: string; variant?: "default" | "compact" }) {
  const addToCart = useAddToCart();
  const img = mainImage(product);
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-float",
        className,
      )}
    >
      <Link to="/produit/$slug" params={{ slug: product.slug }} className="relative block" aria-label={`Voir ${product.name}`}>
        <ProductImage
          src={img}
          alt={product.name}
          className={variant === "compact" ? "aspect-square" : "aspect-[4/5]"}
          imgClassName="img-zoom group-hover:scale-105"
        />
        {product.is_new && <NewBadge className="absolute left-4 top-4" />}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {product.range_label && (
              <p className="font-ui text-[0.65rem] uppercase tracking-[0.2em] text-gold">{product.range_label}</p>
            )}
            <h3 className="font-display text-2xl leading-tight">
              <Link to="/produit/$slug" params={{ slug: product.slug }} className="hover:text-berry">
                {product.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 font-ui text-base font-medium text-plum">{formatPrice(product.price)}</p>
        </div>
        {product.short_description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <AvailabilityDot available={product.is_available} />
          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm">
              <Link to="/produit/$slug" params={{ slug: product.slug }}>Découvrir</Link>
            </Button>
            <Button
              size="sm"
              onClick={() => addToCart(product)}
              disabled={!product.is_available}
              aria-label={`Ajouter ${product.name} au panier`}
            >
              <ShoppingBag /> Ajouter
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
