import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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

// Public catalogue read: publishable key + public SELECT policies only.
export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const [cats, prods] = await Promise.all([
    supabase.from("categories").select("id, slug, name, description, sort_order").order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, slug, name, short_description, description, composition, special_note, price, category_id, range_label, menu_section, is_new, is_exclusive, is_featured, is_available, images, sort_order",
      )
      .order("sort_order"),
  ]);

  if (cats.error || prods.error) {
    console.error("catalog load failed", cats.error ?? prods.error);
    return { categories: [], products: [] };
  }

  return {
    categories: cats.data,
    products: prods.data.map((p) => ({ ...p, price: Number(p.price), images: p.images ?? [] })),
  };
});
