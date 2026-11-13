import otherOne from "@/assets/autre/476cb346-2cc3-45c8-a816-41066b278226.jpg";
import otherTwo from "@/assets/autre/8bc0691e-59a7-496f-a742-fb46bee55af9.jpg";
import otherThree from "@/assets/autre/d9c56f0f-b55f-47d8-9023-2eed7de339f7.jpg";
import newOne from "@/assets/neauveau/special (1).jpg";
import newTwo from "@/assets/neauveau/special (2).jpg";
import newThree from "@/assets/neauveau/special (3).jpg";
import patisserieOne from "@/assets/patissier/1e15f6bd-201f-4c13-bc3e-c86a25420b79.jpg";
import patisserieTwo from "@/assets/patissier/8bc54a1c-8ea3-448a-b218-e6f89a161d77.jpg";
import patisserieThree from "@/assets/patissier/56cc8d1d-922e-445f-916f-e6fe8b9b82c9.jpg";
import patisserieFour from "@/assets/patissier/40235d5c-5a99-4e59-b1b6-4d81e5d94fcb.jpg";
import patisserieFive from "@/assets/patissier/d510dcaa-f9ea-4697-be27-836af1c4c051.jpg";
import patisserieSix from "@/assets/patissier/e92819db-14bc-4ba5-92f2-b9707cb6e3c4.jpg";
import patisserieSeven from "@/assets/patissier/eb101907-dece-41d1-9b15-18f6730f388a.jpg";
import patisserieEight from "@/assets/patissier/f1b43033-00dd-4f02-a4db-464d7b6a9208.jpg";
import exclusiveOne from "@/assets/creation_exclusive/1.jpg";
import exclusiveTwo from "@/assets/creation_exclusive/2.jpg";
import exclusiveThree from "@/assets/creation_exclusive/3.jpg";
import exclusiveFour from "@/assets/creation_exclusive/4.jpg";
import type { Product } from "./catalog.functions";

const NEW_IMAGES = [newOne, newTwo, newThree];
const OTHER_IMAGES = [otherOne, otherTwo, otherThree];
const PATISSERIE_IMAGES = [
  patisserieOne,
  patisserieTwo,
  patisserieThree,
  patisserieFour,
  patisserieFive,
  patisserieSix,
  patisserieSeven,
  patisserieEight,
];
const PATISSERIE_PRODUCT_IMAGES: Record<string, string> = {
  cupcake: patisserieEight,
  tiramisu: patisserieOne,
  cookies: patisserieTwo,
  choux: patisserieThree,
  tarte: patisserieFour,
  "cheesecake-patisserie": patisserieFive,
  cheesecake: patisserieFive,
  eclair: patisserieSix,
  croissant: patisserieSeven,
};
const EXCLUSIVE_IMAGES: Record<string, string> = {
  "verrine-mousse-myrtille": exclusiveOne,
  "poudre-myrtille": exclusiveTwo,
  "blue-sensation": exclusiveThree,
  "effet-neige": exclusiveFour,
};

function stableIndex(slug: string, length: number) {
  return [...slug].reduce((total, character) => total + character.charCodeAt(0), 0) % length;
}

export function fallbackProductImage(product: Pick<Product, "slug" | "is_new" | "category_id" | "is_exclusive">) {
  if (product.is_exclusive && EXCLUSIVE_IMAGES[product.slug]) {
    return EXCLUSIVE_IMAGES[product.slug];
  }
  if (product.category_id === "patisseries") {
    return PATISSERIE_PRODUCT_IMAGES[product.slug] ?? PATISSERIE_IMAGES[stableIndex(product.slug, PATISSERIE_IMAGES.length)];
  }
  if (product.slug === "tarte") {
    return patisserieFour;
  }
  if (product.slug === "cheesecake") {
    return patisserieFive;
  }
  const images = product.is_new ? NEW_IMAGES : OTHER_IMAGES;
  return images[stableIndex(product.slug, images.length)];
}

export function usableProductImages(product: Pick<Product, "images" | "slug" | "is_new" | "category_id" | "is_exclusive">) {
  const validImages = product.images.filter((image) => !image.includes("/__l5e/assets-v1/"));
  return validImages.length > 0 ? validImages : [fallbackProductImage(product)];
}
