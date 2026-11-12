import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { LogoBadge } from "./Logo";

function Social({ icon: Icon, label, url }: { icon: typeof Instagram; label: string; url: string | null }) {
  const inner = (
    <>
      <Icon className="h-4 w-4 text-gold" /> {label}
    </>
  );
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cream">
      {inner}
    </a>
  ) : (
    <span className="flex items-center gap-2">{inner}</span>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-plum-deep text-lavender-soft/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <LogoBadge className="h-24 w-24 ring-1 ring-gold/40" />
          <p className="max-w-xs text-sm leading-relaxed">
            Un univers dédié à la gourmandise, à la créativité et à l'élégance — avec une tendresse particulière pour la myrtille.
          </p>
        </div>
        <div>
          <h3 className="mb-5 font-ui text-xs uppercase tracking-[0.25em] text-gold">Navigation</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/carte" className="hover:text-cream">Notre carte</Link></li>
            <li><Link to="/nouveautes" className="hover:text-cream">Nouveautés</Link></li>
            <li><Link to="/commander" className="hover:text-cream">Commander en ligne</Link></li>
            <li><Link to="/suivi" className="hover:text-cream">Suivre ma commande</Link></li>
            <li><Link to="/a-propos" className="hover:text-cream">Notre histoire</Link></li>
            <li><Link to="/contact" className="hover:text-cream">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 font-ui text-xs uppercase tracking-[0.25em] text-gold">Nous trouver</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{SITE.address}</li>
            {SITE.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="flex items-center gap-2 hover:text-cream">
                  <Phone className="h-4 w-4 text-gold" /> {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={whatsappLink("Bonjour F&R Sweets !")} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cream">
                <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 font-ui text-xs uppercase tracking-[0.25em] text-gold">Suivez-nous</h3>
          <div className="space-y-3 text-sm">
            <Social icon={Instagram} label={SITE.instagram.handle} url={SITE.instagram.url} />
            <Social icon={Facebook} label={SITE.facebook.name} url={SITE.facebook.url} />
          </div>
        </div>
      </div>
      <div className="border-t border-lavender-soft/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} F&R Sweets Café Pâtisserie. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link to="/conditions" className="hover:text-cream">Confidentialité & conditions de vente</Link>
            <Link to="/admin" className="hover:text-cream">Espace admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
