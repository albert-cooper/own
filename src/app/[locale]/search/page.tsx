import { buildPageMetadata, catalogLocale } from "@/lib/seo";
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
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

import PageShell from "@/components/page-shell";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";

const AdPair = dynamic(() => import("@/components/ads/ad-pair"), { ssr: false });

export function generateMetadata({ params: { locale } }: Props) {
  return buildPageMetadata({ locale, path: "/search", noindex: true,
    title: catalogLocale(locale) === "ja-JP" ? "ゲーム検索" : "Search Games",
    description: "Search the online game catalog.",
  });
}

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const { url: normalizedBaseUrl } = getSiteConfig();
  const { hostname } = new URL(normalizedBaseUrl);
  
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  
  const query = (searchParams.q || "").toLowerCase();

  // Filter games based on search query
  const searchResults = query
    ? allGames.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      )
    : [];

  return (
    <PageShell hostname={hostname} categories={categories}>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <AdPair />
        <VStack alignItems="stretch" gap={{ base: 8, md: 12 }} mt={6}>
          <Box>
            <Flex alignItems="center" gap={3} mb={6}>
              <Heading as="h1"
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                color="white"
                textTransform="uppercase"
                letterSpacing="wider"
                borderLeft="4px solid"
                borderColor="cyan.400"
                pl={3}
              >
                {catalogLocale(locale) === "ja-JP" ? "検索結果" : "Search Results"}: {query}
              </Heading>
            </Flex>
            
            {searchResults.length > 0 ? (
              <GameGrid games={searchResults} locale={locale} channel={searchParams?.channel} headingAs="h2" />
            ) : (
              <Box py={10} textAlign="center">
                <Text color="gray.400" fontSize="lg">
                  No games found for &quot;{query}&quot;. Try another search term.
                </Text>
              </Box>
            )}
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