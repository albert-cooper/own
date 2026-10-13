import { cache } from "react";
import { getCategories, getGames } from "./catalog";
import { catalogLocales } from "@/lib/seo";

export const getIndexableCatalog = cache(async () => Promise.all(
  catalogLocales.map(async (locale) => {
    const [games, categories] = await Promise.all([getGames(locale), getCategories(locale)]);
    const categoryIds = new Set(categories.map(category => category.id));
    const paths = new Set([
      "/",
      ...categories.map(category => `/category/${encodeURIComponent(category.alias)}`),
      ...games.filter(game => categoryIds.has(game.categoryId))
        .map(game => `/detail/${encodeURIComponent(String(game.id))}`),
    ]);
    return { locale, paths };
  })
));

export async function availableLocalesFor(path: string) {
  return (await getIndexableCatalog()).filter(catalog => catalog.paths.has(path)).map(catalog => catalog.locale);
}
