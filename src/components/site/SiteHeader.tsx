import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/carte", label: "Notre carte" },
  { to: "/nouveautes", label: "Nouveautés" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count, bump } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (bump === 0) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 460);
    return () => clearTimeout(t);
  }, [bump]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-500",
        scrolled ? "border-border/70 bg-cream/85 shadow-soft backdrop-blur-md" : "border-transparent bg-cream/60 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative font-ui text-sm text-foreground/80 transition-colors hover:text-plum data-[status=active]:text-plum after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full data-[status=active]:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/commander"
            className="hidden rounded-full bg-primary px-5 py-2.5 font-ui text-sm font-medium text-primary-foreground transition-all hover:bg-berry hover:shadow-glow md:inline-flex"
          >
            Commander
          </Link>
          <Link
            to="/panier"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-plum transition-colors hover:bg-lavender-soft"
            aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 font-ui text-[0.65rem] font-semibold text-primary-foreground",
                  pop && "animate-cart-pop",
                )}
              >
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-plum hover:bg-lavender-soft lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-page-in border-t border-border/70 bg-cream lg:hidden" aria-label="Navigation mobile">
          <div className="container-page flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-4 font-display text-2xl text-plum data-[status=active]:text-berry"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/commander"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full bg-primary py-3.5 text-center font-ui text-sm font-medium text-primary-foreground"
            >
              Commander en ligne
            </Link>
            <Link to="/suivi" onClick={() => setOpen(false)} className="mt-3 py-2 text-center font-ui text-sm text-muted-foreground">
              Suivre ma commande
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
