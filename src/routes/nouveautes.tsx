import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQuery, exclusives, newProducts } from "@/lib/catalog";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { ExclusiveSection } from "@/components/site/ExclusiveSection";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — F&R Sweets Café Pâtisserie" },
      { name: "description", content: "Les dernières créations F&R Sweets : verrine mousse à la myrtille, poudre naturelle de myrtille et nos créations exclusives Blue Sensation, L'Original Myrtille et Tartelette Violette & Cassis." },
      { property: "og:title", content: "Nouveautés — F&R Sweets" },
      { property: "og:description", content: "Verrine mousse à la myrtille, poudre naturelle de myrtille et nos créations exclusives." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: NouveautesPage,
});

function NouveautesPage() {
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const news = newProducts(catalog).filter((p) => !p.is_exclusive);
  return (
    <>
      <PageHero eyebrow="Nouveautés" title={<>Nos dernières <span className="italic text-berry">créations</span></>}>
        La myrtille à l'honneur, ses pigments naturels et trois créations exclusives imaginées pour vous surprendre.
      </PageHero>
      <section className="container-page py-16">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {news.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
      <ExclusiveSection products={exclusives(catalog)} />
    </>
  );
}
