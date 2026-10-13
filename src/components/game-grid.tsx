import { Box } from "@chakra-ui/react";
import type { Locale } from "@/i18n/routing";
import type { Games } from "@/services/data";
import GameItem from "@/components/game-item";

export default function GameGrid({ games, locale, channel, headingAs = "h3" }: {
  games: Games;
  locale: Locale;
  channel?: string;
  headingAs?: "h2" | "h3";
}) {
  return (
    <Box as="ul" role="list" m={0} p={0} listStyleType="none" sx={{
      columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
      columnGap: { base: 3, md: 4, lg: 5 },
    }}>
      {games.map((game, index) => (
        <Box as="li" key={`${game.id}-${index}`} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
          <GameItem data={game} locale={locale} channel={channel} headingAs={headingAs} />
        </Box>
      ))}
    </Box>
  );
}
