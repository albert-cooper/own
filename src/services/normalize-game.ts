import { GameRecord } from "./data";

type RawGame = Omit<GameRecord, "image" | "categoryId"> & {
  image?: string;
  thumb?: string;
  categoryId?: number;
  category?: number;
};

export function normalizeGame(game: RawGame): GameRecord {
  return {
    ...game,
    image: game.image || game.thumb || "/static/images/placeholder-150.png",
    categoryId: game.categoryId ?? game.category ?? 0,
  };
}
