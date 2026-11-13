export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  composition: string | null;
  special_note: string | null;
  price: number;
  category_id: string | null;
  range_label: string | null;
  menu_section: string | null;
  is_new: boolean;
  is_exclusive: boolean;
  is_featured: boolean;
  is_available: boolean;
  images: string[];
  sort_order: number;
};

export type Catalog = { categories: Category[]; products: Product[] };

const categories: Category[] = [
  { id: "verrines", slug: "verrines", name: "Verrines", description: null, sort_order: 1 },
  { id: "entremets", slug: "entremets", name: "Entremets", description: null, sort_order: 2 },
  { id: "cheesecakes", slug: "cheesecakes", name: "Cheesecakes", description: null, sort_order: 3 },
  { id: "tartes", slug: "tartes", name: "Tartes", description: null, sort_order: 4 },
  { id: "patisseries", slug: "patisseries", name: "Pâtisseries", description: null, sort_order: 5 },
  { id: "boissons", slug: "boissons", name: "Boissons", description: null, sort_order: 6 },
];

const products: Product[] = [
  { id: "verrine-mousse-myrtille", slug: "verrine-mousse-myrtille", name: "Verrine mousse à la myrtille", short_description: "Couches de mousse onctueuse à la myrtille, décor de baies fraîches.", description: "Une verrine légère et gourmande aux couleurs naturelles.", composition: "Mousse à la myrtille, crème et fruits frais.", special_note: null, price: 12, category_id: "verrines", range_label: "Spécial F&R Sweets", menu_section: "Spécial F&R Sweets", is_new: true, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 1 },
  { id: "cupcake", slug: "cupcake", name: "Cupcake", short_description: "Un cupcake gourmand F&R Sweets.", description: null, composition: null, special_note: null, price: 5.5, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 2 },
  { id: "tiramisu", slug: "tiramisu", name: "Tiramisu", short_description: "Un tiramisu onctueux et gourmand.", description: null, composition: null, special_note: null, price: 10, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 3 },
  { id: "cookies", slug: "cookies", name: "Cookies", short_description: "Des cookies gourmands fraîchement préparés.", description: null, composition: null, special_note: null, price: 6, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 4 },
  { id: "choux", slug: "choux", name: "Choux", short_description: "De délicats choux pâtissiers.", description: null, composition: null, special_note: null, price: 6, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 5 },
  { id: "tarte", slug: "tarte", name: "Tarte", short_description: "Une tarte délicate et gourmande.", description: null, composition: null, special_note: null, price: 5, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 6 },
  { id: "cheesecake-patisserie", slug: "cheesecake-patisserie", name: "Cheesecake", short_description: "Un cheesecake crémeux et gourmand.", description: null, composition: null, special_note: null, price: 10, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 7 },
  { id: "eclair", slug: "eclair", name: "Éclair", short_description: "Un éclair fin et gourmand.", description: null, composition: null, special_note: null, price: 7.5, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 8 },
  { id: "croissant", slug: "croissant", name: "Croissant", short_description: "Un croissant croustillant et fondant.", description: null, composition: null, special_note: null, price: 4.5, category_id: "patisseries", range_label: "Créations pâtissières", menu_section: "Pâtisseries", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 9 },
  { id: "cheesecake", slug: "cheesecake", name: "Cheesecake", short_description: "Cheesecake crémeux, disponible en version classique ou prestige.", description: null, composition: null, special_note: null, price: 10, category_id: "cheesecakes", range_label: "Desserts Prestige", menu_section: "Desserts Prestige", is_new: false, is_exclusive: false, is_featured: true, is_available: true, images: [], sort_order: 3 },
  { id: "blue-sensation", slug: "blue-sensation", name: "Blue Sensation", short_description: "Une création signature intense et délicate autour des fruits violets.", description: null, composition: null, special_note: null, price: 14, category_id: "entremets", range_label: "Collection 2026", menu_section: "Créations exclusives", is_new: true, is_exclusive: true, is_featured: true, is_available: true, images: [], sort_order: 4 },
  { id: "original-myrtille", slug: "original-myrtille", name: "L'Original Myrtille", short_description: "La création emblématique de la maison.", description: null, composition: null, special_note: null, price: 13, category_id: "entremets", range_label: "Collection 2026", menu_section: "Créations exclusives", is_new: true, is_exclusive: true, is_featured: true, is_available: true, images: [], sort_order: 5 },
  { id: "tartelette-violette-cassis", slug: "tartelette-violette-cassis", name: "Tartelette Violette & Cassis", short_description: "Une tartelette florale et fruitée.", description: null, composition: null, special_note: null, price: 11, category_id: "tartes", range_label: "Collection 2026", menu_section: "Créations exclusives", is_new: true, is_exclusive: true, is_featured: true, is_available: true, images: [], sort_order: 6 },
];

export async function getCatalog(): Promise<Catalog> {
  return { categories, products };
}
