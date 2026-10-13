import { buildPageMetadata, catalogLocale } from "@/lib/seo";
import { availableLocalesFor } from "@/services/seo-catalog";
import { getCategory } from "@/services/catalog";
import GameGrid from "@/components/game-grid";
import { getSiteConfig } from "@/config/site";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  VStack,
  Heading,
  Flex,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}

import PageShell from "@/components/page-shell";
import Info from "@/components/info";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { randomGames } from "@/utils";
const AdPair = dynamic(() => import("@/components/ads/ad-pair"), { ssr: false });

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const category = await getCategory(locale, slug);
  const path = `/category/${encodeURIComponent(slug)}`;
  const japanese = catalogLocale(locale) === "ja-JP";
  return buildPageMetadata({ locale, path,
    title: japanese ? `${category.name}のゲーム` : `${category.name} Games`,
    description: japanese ? `${category.name}のブラウザゲームを探して、ゲームの紹介を読んで遊びましょう。` : `Browse ${category.name} browser games, read their introductions, and choose a game to play online.`,
    availableLocales: await availableLocalesFor(path),
  });
}

export default async function Page({
  params: { locale, slug },
  searchParams,
}: Props) {
  const { url: normalizedBaseUrl } = getSiteConfig();
  const { hostname } = new URL(normalizedBaseUrl);
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const category = categories.find((item) => item.alias === slug);

  if (!category) {
    return notFound();
  }

  const _list = allGames.filter(
    (item) => item.categoryId === category.id 
  );
  const categoryByGames = randomGames(_list.length, 8).map((item) => _list[item]);

  return (
    <PageShell hostname={hostname} categories={categories}>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <AdPair>
          {categoryByGames[0] && (
            <Box w={{ base: "320px", md: "100%" }} maxW="728px" mb="8px">
              <GameItem
                headingAs="p"
                data={categoryByGames[0]}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          )}
        </AdPair>
        <VStack alignItems="stretch" gap={{ base: 8, md: 12 }} mt={6}>
          <Box>
            <Flex alignItems="center" gap={3} mb={6}>
              <Heading as="h1"
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                color="white"
                textTransform="uppercase"
                letterSpacing="wider"
                borderLeft="4px solid"
                borderColor="orange.400"
                pl={3}
              >
                {t("Games", { category: category.name })}
              </Heading>
            </Flex>
            <GameGrid games={categoryByGames.slice(1)} locale={locale} channel={searchParams?.channel} headingAs="h2" />
          </Box>
          <Box
            bg="gray.800"
            rounded={{ base: "xl", md: "2xl" }}
            p={{ base: 4, md: 6 }}
            border="1px solid"
            borderColor="gray.700"
          >
            <Info locale={locale} />
          </Box>
        </VStack>
      </Container>
    </PageShell>
  );
}
