 



import { buildPageMetadata } from "@/lib/seo";
import { Locale } from "@/i18n/routing";

import { getGame } from "@/actions";
import RedirectPlay from "@/components/game-redirect";

interface Props {
  params: {
    locale: Locale;
    id: string;
  };
  searchParams: Record<string, string>;
}
export async function generateMetadata({ params: { locale, id } }: Props) {
  const game = await getGame(locale, id);
  return buildPageMetadata({ locale, path: `/play/${encodeURIComponent(String(game.id))}`,
    title: game.name, description: game.description || game.name, noindex: true });
}

export default async function Page({
  params: { id, locale },
}: Props) {
  const {  gameUrl } = await getGame(locale, id); 

  return <RedirectPlay url={gameUrl} />
}
