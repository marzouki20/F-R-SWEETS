import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { catalogQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";
import menuImg from "@/assets/menu/menu.jpg";

type CarteSearch = { categorie?: string; q?: string };

export const Route = createFileRoute("/carte")({
  validateSearch: (s: Record<string, unknown>): CarteSearch => ({
    categorie: typeof s.categorie === "string" && s.categorie ? s.categorie : undefined,
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Notre carte — F&R Sweets Café Pâtisserie" },
      { name: "description", content: "Toute la carte F&R Sweets : verrines, entremets, cheesecakes, tartes, pâtisseries, boissons et créations à la myrtille. Prix en DT, commande en ligne." },
      { property: "og:title", content: "Notre carte — F&R Sweets" },
      { property: "og:description", content: "Verrines, entremets, cheesecakes, tartes et créations à la myrtille. Commandez en ligne." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: CartePage,
});

const PRIMARY_FILTERS = ["verrines", "entremets", "cheesecakes", "tartes"] as const;

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function CartePage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const { categorie = "tous", q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/carte" });
  const [query, setQuery] = useState(q);

  useEffect(() => setQuery(q), [q]);

  const filters = useMemo(() => {
    const byslug = new Map(catalog.categories.map((c) => [c.slug, c]));
    const primary = PRIMARY_FILTERS.map((s) => byslug.get(s)).filter(Boolean).map((c) => ({ value: c!.slug, label: c!.name }));
    const rest = catalog.categories
      .filter((c) => !PRIMARY_FILTERS.includes(c.slug as (typeof PRIMARY_FILTERS)[number]))
      .map((c) => ({ value: c.slug, label: c.name }));
    return [
      { value: "tous", label: "Tous les produits" },
      ...primary,
      { value: "nouveautes", label: "Nouveautés" },
      { value: "exclusives", label: "Créations exclusives" },
      ...rest,
    ];
  }, [catalog.categories]);

  const products = useMemo(() => {
    const cat = catalog.categories.find((c) => c.slug === categorie);
    const needle = normalize(query.trim());
    return catalog.products.filter((p) => {
      if (categorie === "nouveautes" && !p.is_exclusive) return false;
      if (categorie === "exclusives" && !p.is_exclusive) return false;
      if (cat && p.category_id !== cat.id && !(categorie === "cheesecakes" && p.slug === "cheesecake-patisserie")) return false;
      if (needle) {
        const hay = normalize(`${p.name} ${p.short_description ?? ""} ${p.composition ?? ""} ${p.range_label ?? ""}`);
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [catalog, categorie, query]);

  const setFilter = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, categorie: value === "tous" ? undefined : value }), resetScroll: false });

  return (
    <>
      <PageHero eyebrow="La carte" title={<>Notre carte <span className="italic text-berry">gourmande</span></>}>
        Desserts Prestige, Sweets classiques, créations à la myrtille et boissons — tous nos prix sont en dinars tunisiens.
      </PageHero>

      <div className="sticky top-20 z-30 border-y border-border/70 bg-cream/90 backdrop-blur-md">
        <div className="container-page flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:pb-0" role="tablist" aria-label="Filtrer par catégorie">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={categorie === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 font-ui text-xs transition-all",
                  categorie === f.value
                    ? "border-plum bg-plum text-primary-foreground shadow-soft"
                    : "border-border bg-card text-foreground/75 hover:border-lavender hover:text-plum",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-72">
            <span className="sr-only">Rechercher un dessert</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => navigate({ search: (prev) => ({ ...prev, q: query.trim() || undefined }), replace: true, resetScroll: false })}
              placeholder="Rechercher un dessert…"
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-10 font-ui text-sm outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/40"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-plum" aria-label="Effacer la recherche">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>
      </div>

      <section className="container-page py-12">
        {categorie === "nouveautes" && (
          <div className="nouveautes-highlight mb-8 rounded-3xl border border-gold/50 bg-lavender-mist p-6 text-center shadow-glow">
            <p className="eyebrow animate-page-in">À découvrir maintenant</p>
            <h2 className="mt-2 font-display text-3xl text-plum">Nos créations exclusives</h2>
            <p className="mt-2 text-muted-foreground">Une sélection inédite imaginée pour vous surprendre.</p>
          </div>
        )}
        <p className="mb-6 font-ui text-sm text-muted-foreground">
          {products.length} création{products.length > 1 ? "s" : ""}
        </p>
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-lavender bg-lavender-mist/50 p-16 text-center">
            <p className="font-display text-3xl text-plum">Aucun dessert ne correspond</p>
            <p className="mt-3 text-muted-foreground">Essayez un autre mot-clé ou une autre catégorie.</p>
            <button type="button" onClick={() => { setQuery(""); setFilter("tous"); }} className="mt-6 font-ui text-sm text-berry underline-offset-4 hover:underline">
              Voir toute la carte
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-8">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-lavender-mist/60 p-6 md:grid-cols-[280px_1fr] md:p-10">
          <a href={menuImg} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl shadow-soft">
            <img src={menuImg} alt="Carte originale F&R Sweets" loading="lazy" className="w-full transition-transform duration-700 hover:scale-105" />
          </a>
          <div>
            <p className="eyebrow">Au comptoir</p>
            <h2 className="mt-3 text-4xl">Notre carte originale</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Retrouvez la carte telle qu'elle est affichée en boutique. Vous préférez commander rapidement ?
              Notre page de commande regroupe tous les produits par rubrique.
            </p>
            <Link to="/commander" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-ui text-sm text-primary-foreground transition hover:bg-berry">
              Commander en ligne
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
