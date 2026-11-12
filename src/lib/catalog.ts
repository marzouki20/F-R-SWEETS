import { queryOptions } from "@tanstack/react-query";
import { getCatalog, type Catalog, type Product } from "./catalog.functions";
import { fallbackProductImage, usableProductImages } from "./product-images";

export type { Catalog, Product, Category } from "./catalog.functions";

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 60_000,
});

export function categoryOf(catalog: Catalog, product: Product) {
  return catalog.categories.find((c) => c.id === product.category_id) ?? null;
}

export function mainImage(product: Pick<Product, "images" | "slug" | "is_new">): string {
  return usableProductImages(product)[0] ?? fallbackProductImage(product);
}

export function exclusives(catalog: Catalog) {
  return catalog.products.filter((p) => p.is_exclusive);
}

export function newProducts(catalog: Catalog) {
  return catalog.products.filter((p) => p.is_new);
}
