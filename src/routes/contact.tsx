import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — F&R Sweets Café Pâtisserie" },
      { name: "description", content: "Contactez F&R Sweets à Ez Zahra pour une commande ou une question." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Nous trouver" title={<>Parlons de votre prochaine <span className="italic text-berry">douceur</span></>}>
        Une question, une commande spéciale ou simplement envie de nous écrire ? Nous sommes à votre écoute.
      </PageHero>
      <section className="container-page grid gap-8 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl bg-plum-gradient p-8 text-primary-foreground shadow-float md:p-10">
          <p className="eyebrow text-gold-soft">F&R Sweets</p>
          <h2 className="mt-4 text-4xl text-cream">Au plaisir de vous accueillir</h2>
          <div className="mt-8 space-y-6 text-sm text-lavender-soft/90">
            <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold" />{SITE.address}</p>
            <p className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold" />Ouvert pour vos pauses gourmandes et vos commandes.</p>
            {SITE.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`} className="flex gap-3 hover:text-cream">
                <Phone className="h-5 w-5 shrink-0 text-gold" />{phone.label}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
          <h2 className="font-display text-4xl text-plum">Contactez-nous</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Pour une réponse rapide, écrivez-nous directement sur WhatsApp ou appelez-nous.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a href={whatsappLink("Bonjour F&R Sweets, je souhaite avoir des informations.")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-ui text-sm text-primary-foreground transition hover:bg-berry">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={`tel:${SITE.phones[0].tel}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-plum/30 px-5 py-3 font-ui text-sm text-plum transition hover:bg-lavender-soft">
              <Phone className="h-4 w-4" /> Appeler
            </a>
          </div>
          <div className="mt-10 rounded-2xl bg-lavender-mist p-5 text-sm text-muted-foreground">
            <p className="font-ui text-xs uppercase tracking-[0.18em] text-gold">Localisation</p>
            <p className="mt-2 text-plum">{SITE.mapQuery}</p>
          </div>
        </div>
      </section>
    </>
  );
}
