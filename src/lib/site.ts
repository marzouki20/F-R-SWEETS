// Brand facts provided by F&R Sweets. Keep unverified links as null — they render as plain text.
export const SITE = {
  name: "F&R Sweets Café Pâtisserie",
  shortName: "F&R Sweets",
  tagline: "Café-Pâtisserie",
  address: "Ez Zahra, à proximité du lycée Ibn Rachiq",
  phones: [
    { label: "29 999 369", tel: "+21629999369" },
    { label: "27 783 792", tel: "+21627783792" },
  ],
  // WhatsApp number to confirm with F&R Sweets (defaults to the first phone number).
  whatsapp: "21629999369",
  instagram: { handle: "@f-r.sweets", url: null as string | null },
  facebook: { name: "F&R Sweets", url: null as string | null },
  mapQuery: "Lycée Ibn Rachiq, Ez Zahra, Ben Arous, Tunisie",
  currency: "DT",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
