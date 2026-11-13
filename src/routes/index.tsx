import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Instagram, Leaf, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogQuery, exclusives } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ExclusiveSection } from "@/components/site/ExclusiveSection";
import verrineImg from "@/assets/neauveau/special (1).jpg";
import cheesecakeImg from "@/assets/neauveau/special (2).jpg";
import blancheImg from "@/assets/neauveau/special (3).jpg";
import poudreImg from "@/assets/autre/476cb346-2cc3-45c8-a816-41066b278226.jpg";
import vitrineImg from "@/assets/autre/8bc0691e-59a7-496f-a742-fb46bee55af9.jpg";
import menuImg from "@/assets/menu/menu.jpg";
import mainLogoImg from "@/assets/logo/1.jpg";
import patisserieImg from "@/assets/patissier/1e15f6bd-201f-4c13-bc3e-c86a25420b79.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "F&R Sweets Café Pâtisserie | Pâtisseries et créations gourmandes" },
      {
        name: "description",
        content:
          "Découvrez F&R Sweets Café Pâtisserie à Ez Zahra. Explorez nos verrines, entremets, cheesecakes et créations originales à la myrtille. Commandez vos desserts en ligne.",
      },
      { property: "og:title", content: "F&R Sweets Café Pâtisserie | Pâtisseries et créations gourmandes" },
      {
        property: "og:description",
        content: "Verrines, entremets, cheesecakes et créations originales à la myrtille. Commandez vos desserts en ligne.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: Home,
});

const CREATIONS = [
  { title: "Nos pâtisseries", text: "Cheesecakes, tartes, éclairs, choux… nos classiques et prestige.", img: patisserieImg, search: { categorie: "patisseries" } },
  { title: "Nos créations signature", text: "Des pièces inédites, pensées comme de petits bijoux gourmands.", img: blancheImg, search: { categorie: "exclusives" } },
] as const;

function Home() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container-page grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
          <div className="order-2 lg:order-1">
            <p className="eyebrow animate-page-in">Café-Pâtisserie · Ez Zahra</p>
            <h1 className="mt-6 text-5xl leading-[0.98] md:text-6xl xl:text-7xl">
              Une touche de douceur,
              <span className="block italic text-berry">une explosion de saveurs.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Découvrez l'univers gourmand de F&R Sweets, où créativité, élégance et passion se rencontrent dans chaque création.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/carte">Découvrir notre carte <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="gold">
                <Link to="/commander">Commander maintenant</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["Myrtille", "au cœur"],
                ["Clean", "Label"],
                ["Fait", "maison"],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt className="font-display text-2xl text-plum">{a}</dt>
                  <dd className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-6 -z-0 rounded-[2.5rem] border border-gold/30 md:-inset-8" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] shadow-float">
              <img
                src={mainLogoImg}
                alt="F&R Sweets Café-Pâtisserie"
                className="aspect-[4/5] w-full object-cover object-[45%_50%] md:aspect-[5/6]"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NOS CRÉATIONS */}
      <section className="container-page py-24">
        <Reveal>
          <SectionHeading eyebrow="L'atelier" title="Nos créations">
            Des desserts pensés comme de petites œuvres : textures, couleurs et saveurs en parfait équilibre.
          </SectionHeading>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CREATIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 120}>
              <Link to="/carte" search={c.search} className="group relative block overflow-hidden rounded-2xl shadow-soft">
                <img src={c.img} alt={c.title} loading="lazy" className="img-zoom aspect-[3/4] w-full object-cover group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/85 via-plum-deep/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-3xl text-cream">{c.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-lavender-soft/90">{c.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-ui text-sm text-gold-soft transition-all group-hover:gap-3">
                    Découvrir <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXCLUSIVES */}
      <ExclusiveSection products={exclusives(catalog)} />

      {/* PHILOSOPHIE */}
      <section className="container-page grid items-center gap-14 py-24 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img src={vitrineImg} alt="Poudre de myrtille F&R Sweets en vitrine, Clean Label" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-float" />
            <img src={poudreImg} alt="Pot de poudre naturelle de myrtille 40 ml" loading="lazy" className="absolute -bottom-10 -right-4 hidden w-48 rounded-2xl border-4 border-cream object-cover shadow-float md:block" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading align="left" eyebrow="Notre philosophie" title="La gourmandise au naturel">
            Chez F&R Sweets, nous aimons associer créativité, qualité visuelle et plaisir gourmand. Nos créations mettent à l'honneur des ingrédients soigneusement valorisés, notamment la myrtille et ses pigments naturels, dans une approche inspirée du Clean Label.
          </SectionHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "Créativité pâtissière" },
              { icon: Leaf, title: "Ingrédients valorisés" },
              { icon: HeartHandshake, title: "Passion et savoir-faire" },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1">
                <Icon className="h-6 w-6 text-gold" />
                <p className="mt-4 font-display text-xl leading-tight text-plum">{title}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* INSTAGRAM */}
      <section className="container-page pb-8">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <Instagram className="h-6 w-6 text-gold" />
            <h2 className="text-4xl md:text-5xl">Suivez nos douceurs</h2>
            {SITE.instagram.url ? (
              <a href={SITE.instagram.url} target="_blank" rel="noreferrer" className="font-ui text-berry hover:underline">
                {SITE.instagram.handle}
              </a>
            ) : (
              <p className="font-ui text-berry">{SITE.instagram.handle}</p>
            )}
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          { [verrineImg, cheesecakeImg, poudreImg, blancheImg, vitrineImg, menuImg].map((src, i) => (
            <Reveal key={src} delay={i * 60}>
              <div className="group overflow-hidden rounded-xl">
                <img src={src} alt="Création F&R Sweets" loading="lazy" className="img-zoom aspect-square w-full object-cover group-hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
