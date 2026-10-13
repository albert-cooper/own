import { normalizeGame } from "./normalize-game";
import { notFound } from "next/navigation";
import { Locale } from "@/i18n/routing";
import { CategoryRecord, GameRecord, Games } from "./data";

const loaders = {
  "en-US": { games: () => import("../../data/en-US/data.json"), categories: () => import("../../data/en-US/categories.json") },
  "ja-JP": { games: () => import("../../data/ja-JP/data.json"), categories: () => import("../../data/ja-JP/categories.json") },
};
const loaderFor = (locale: Locale) => loaders[locale === "ja-JP" ? "ja-JP" : "en-US"];

export async function getGames(locale: Locale): Promise<Games> {
  return (await loaderFor(locale).games()).default.map(normalizeGame);
}
export async function getCategories(locale: Locale): Promise<CategoryRecord[]> {
  return (await loaderFor(locale).categories()).default;
}
export async function getCategory(locale: Locale, slug: string) {
  const [categories, allGames] = await Promise.all([getCategories(locale), getGames(locale)]);
  const category = categories.find(item => item.alias === slug);
  if (!category) notFound();
  return { ...category, games: allGames.filter(game => game.categoryId === category.id) };
}
export async function getGame(locale: Locale, slug: string): Promise<GameRecord> {
  const game = (await getGames(locale)).find(item => String(item.id) === slug);
  if (!game) notFound();
  return game;
}
