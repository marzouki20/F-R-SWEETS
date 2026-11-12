import otherOne from "@/assets/autre/476cb346-2cc3-45c8-a816-41066b278226.jpg";
import otherTwo from "@/assets/autre/8bc0691e-59a7-496f-a742-fb46bee55af9.jpg";
import otherThree from "@/assets/autre/d9c56f0f-b55f-47d8-9023-2eed7de339f7.jpg";
import newOne from "@/assets/neauveau/special (1).jpg";
import newTwo from "@/assets/neauveau/special (2).jpg";
import newThree from "@/assets/neauveau/special (3).jpg";
import type { Product } from "./catalog.functions";

const NEW_IMAGES = [newOne, newTwo, newThree];
const OTHER_IMAGES = [otherOne, otherTwo, otherThree];

function stableIndex(slug: string, length: number) {
  return [...slug].reduce((total, character) => total + character.charCodeAt(0), 0) % length;
}

export function fallbackProductImage(product: Pick<Product, "slug" | "is_new">) {
  const images = product.is_new ? NEW_IMAGES : OTHER_IMAGES;
  return images[stableIndex(product.slug, images.length)];
}

export function usableProductImages(product: Pick<Product, "images" | "slug" | "is_new">) {
  const validImages = product.images.filter((image) => !image.includes("/__l5e/assets-v1/"));
  return validImages.length > 0 ? validImages : [fallbackProductImage(product)];
}
