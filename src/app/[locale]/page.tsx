import { buildPageMetadata, catalogLocale, homeCopy } from "@/lib/seo";
import GameGrid from "@/components/game-grid";
import { getSiteConfig } from "@/config/site";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  Text,
  Flex,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import PageShell from "@/components/page-shell";
import { getTargetHref, randomGames } from "@/utils";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { FaChevronRight } from "react-icons/fa6";
const AdPair = dynamic(() => import("@/components/ads/ad-pair"), { ssr: false });
interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

export function generateMetadata({ params: { locale } }: Props) {
  return buildPageMetadata({ locale, ...homeCopy[catalogLocale(locale)] });
}

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const { url: normalizedBaseUrl } = getSiteConfig();
  const { hostname } = new URL(normalizedBaseUrl);
  const allGames = await getGames(locale);
  const categories = await getCategories(locale);
  const t = await getTranslations({ locale, namespace: "Common" });

  const newGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const adInsertedGame = randomGames(allGames.length, 1).map((item) => allGames[item])[0];
  
  return (
    <PageShell hostname={hostname} categories={categories}>
      <Container
        maxWidth="container.xl"
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <Box as="header" mb={6} lang={catalogLocale(locale)}>
          <Heading as="h1" color="white" fontSize={{ base: "2xl", md: "3xl" }}>
            {homeCopy[catalogLocale(locale)].title}
          </Heading>
          <Text mt={2} color="gray.400">{homeCopy[catalogLocale(locale)].description}</Text>
        </Box>
        <AdPair>
          {adInsertedGame && (
            <Box w={{ base: "320px", md: "100%" }} maxW="728px" mb="8px">
              <GameItem
                headingAs="p"
                data={adInsertedGame}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          )}
        </AdPair>
        <VStack alignItems="stretch" gap={{ base: 8, md: 12 }} mt={6}>
          <Box as="section" aria-labelledby="new-games">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Heading as="h2" id="new-games"
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                textTransform="uppercase"
                color="white"
                letterSpacing="wider"
                borderLeft="4px solid"
                borderColor="cyan.400"
                pl={3}
              >
                {t("Games", { category: t("New") })}
              </Heading>
            </Flex>
            <GameGrid games={newGames} locale={locale} channel={searchParams?.channel} />
          </Box>
          
          <Box as="section" aria-labelledby="top-games">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Heading as="h2" id="top-games"
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                textTransform="uppercase"
                color="white"
                letterSpacing="wider"
                borderLeft="4px solid"
                borderColor="purple.400"
                pl={3}
              >
                {t("Games", { category: t("Top") })}
              </Heading>
            </Flex>
            <GameGrid games={topGames} locale={locale} channel={searchParams?.channel} />
          </Box>

          {categories.map((category) => {
            const games = allGames.filter((game) => game.categoryId === category.id);
            const gamesList = randomGames(games.length, 12).map((item) => games[item]);
            if (!gamesList.length) {
              return null;
            }

            return (
              <Box as="section" key={category.alias} aria-labelledby={`category-${category.alias}`}>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  mb={4}
                >
                  <Flex
                    justifyContent="space-between"
                    w="full"
                    alignItems="center"
                    gap={4}
                  >
                    <Heading as="h2" id={`category-${category.alias}`}
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      color="white"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      borderLeft="4px solid"
                      borderColor="orange.400"
                      pl={3}
                    >
                      {t("Games", { category: category.name })}
                    </Heading>
                    <Flex
                      alignItems="center"
                      as="a"
                      href={getTargetHref(
                        locale,
                        `/category/${category.alias}`,
                        searchParams?.channel
                      )}
                      color="gray.400"
                      fontWeight="bold"
                      fontSize="sm"
                      _hover={{ color: "cyan.400" }}
                      transition="color 0.2s"
                    >
                      {t("More")}
                      <FaChevronRight size="12px" style={{ marginLeft: "4px" }} />
                    </Flex>
                  </Flex>
                </Flex>
                <GameGrid games={gamesList} locale={locale} channel={searchParams?.channel} />
              </Box>
            );
          })}
          
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
