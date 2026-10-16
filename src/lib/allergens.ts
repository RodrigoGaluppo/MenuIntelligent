import type { Locale, Product } from "./types";

type AllergenId = "gluten" | "crustaceans" | "eggs" | "fish" | "milk" | "nuts" | "mustard" | "molluscs";

const rules: { id: AllergenId; namedIngredient: RegExp }[] = [
  { id: "gluten", namedIngredient: /\b(bread|toast|rye|pappardelle|crumble)\b/i },
  { id: "crustaceans", namedIngredient: /\b(prawns?|lobster)\b/i },
  { id: "eggs", namedIngredient: /\b(egg|meringue|mayonnaise|mayo)\b/i },
  { id: "fish", namedIngredient: /\b(herring|tuna|anchov(?:y|ies)|halibut)\b/i },
  { id: "milk", namedIngredient: /\b(curd|cheeses?|emilgrana|gorgonzola|cream|butter|mascarpone)\b/i },
  { id: "nuts", namedIngredient: /\b(pistachio|walnut)\b/i },
  { id: "mustard", namedIngredient: /\bmustard\b/i },
  { id: "molluscs", namedIngredient: /\b(scallops?|octopus)\b/i },
];

export const allergenLabels: Record<AllergenId, Record<Locale, string>> = {
  gluten: { pl: "Zboża z glutenem", en: "Cereals with gluten", uk: "Злаки з глютеном" },
  crustaceans: { pl: "Skorupiaki", en: "Crustaceans", uk: "Ракоподібні" },
  eggs: { pl: "Jaja", en: "Eggs", uk: "Яйця" },
  fish: { pl: "Ryby", en: "Fish", uk: "Риба" },
  milk: { pl: "Mleko", en: "Milk", uk: "Молоко" },
  nuts: { pl: "Orzechy", en: "Tree nuts", uk: "Горіхи" },
  mustard: { pl: "Gorczyca", en: "Mustard", uk: "Гірчиця" },
  molluscs: { pl: "Mięczaki", en: "Molluscs", uk: "Молюски" },
};

export const allergenCopy: Record<Locale, { listed: string; none: string; check: string; optionalPrawns: string; optionalPistachio: string }> = {
  pl: {
    listed: "Alergeny wskazane przez składniki w menu",
    none: "W opublikowanym opisie nie wymieniono składnika z listy alergenów UE.",
    check: "Pełna receptura, sosy i możliwy kontakt krzyżowy wymagają potwierdzenia z obsługą przed zamówieniem.",
    optionalPrawns: "Dodatek krewetek: skorupiaki.",
    optionalPistachio: "Wariant pistacjowy: orzechy.",
  },
  en: {
    listed: "Allergens indicated by listed ingredients",
    none: "No EU-listed allergen is named in the published ingredient description.",
    check: "Please confirm the full recipe, sauces and possible cross-contact with our team before ordering.",
    optionalPrawns: "Prawn add-on: crustaceans.",
    optionalPistachio: "Pistachio option: tree nuts.",
  },
  uk: {
    listed: "Алергени, зазначені у складі меню",
    none: "В опублікованому описі не названо інгредієнтів зі списку алергенів ЄС.",
    check: "Перед замовленням уточніть у персоналу повний склад, соуси та можливий перехресний контакт.",
    optionalPrawns: "Добавка креветок: ракоподібні.",
    optionalPistachio: "Фісташковий варіант: горіхи.",
  },
};

export function listedAllergens(product: Product): AllergenId[] {
  const ingredients = `${product.ingredients.en} ${product.description.en}`;
  return rules.filter(({ id, namedIngredient }) => {
    if (id === "nuts" && product.id === "ice-cream-olive") return false; // Only the pistachio choice.
    return namedIngredient.test(ingredients);
  }).map(({ id }) => id);
}

export function hasRestaurantAllergenList(product: Product) {
  return product.allergens.en !== "Please ask our team about allergens before ordering.";
}
