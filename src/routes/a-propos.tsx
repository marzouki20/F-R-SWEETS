import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import storyImage from "@/assets/autre/8bc0691e-59a7-496f-a742-fb46bee55af9.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — F&R Sweets Café Pâtisserie" },
      { name: "description", content: "Découvrez l'histoire et l'univers gourmand de F&R Sweets à Ez Zahra." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Notre histoire" title={<>Une passion pour les <span className="italic text-berry">douceurs</span></>}>
        F&R Sweets est un café-pâtisserie où chaque création est préparée avec soin, créativité et une attention particulière aux détails.
      </PageHero>
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <img src={storyImage} alt="L'univers gourmand de F&R Sweets" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-float" />
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">F&R Sweets · Ez Zahra</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Des créations faites avec <span className="italic text-berry">cœur</span></h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Nous imaginons des desserts élégants et généreux, inspirés par les produits que nous aimons. Notre univers met la myrtille à l'honneur, avec des couleurs naturelles, des textures délicates et des recettes pensées pour être partagées.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            De la verrine aux pâtisseries classiques, chaque douceur est une invitation à prendre le temps de savourer.
          </p>
          <Link to="/carte" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-ui text-sm text-primary-foreground transition hover:bg-berry">
            Découvrir la carte <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
      <section className="bg-lavender-mist py-16">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Créatif", text: "Des associations originales et des présentations qui surprennent." },
            { icon: HeartHandshake, title: "Généreux", text: "Des portions pensées pour le plaisir et les beaux moments." },
            { icon: Leaf, title: "Naturel", text: "La myrtille et ses pigments naturels au cœur de notre signature." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
              <item.icon className="mx-auto h-7 w-7 text-gold" />
              <h3 className="mt-4 font-display text-2xl text-plum">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
