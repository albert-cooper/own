export const runtime = "edge";

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

import Header from "@/components/header";
import Footer from "@/components/footer";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";

const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://giftstiktok.xyz";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
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
    <Box bg="gray.900" minH="100vh">
      <Header categories={categories} hostname={hostname} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <ElTemplate
            divId="div-gpt-ad-1782614717055-0"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 100], [320, 50]]}
            minWidth={320}
            minHeight={100}
            style={{ marginBottom: '8px' }}
          />
          <ElTemplate
            divId="div-gpt-ad-1782614717055-1"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 50], [320, 100]]}
            minWidth={320}
            minHeight={50}
          />
        </Box>
        <VStack alignItems="stretch" gap={{ base: 8, md: 12 }} mt={6}>
          <Box>
            <Flex alignItems="center" gap={3} mb={6}>
              <Heading
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                color="white"
                textTransform="uppercase"
                letterSpacing="wider"
                borderLeft="4px solid"
                borderColor="cyan.400"
                pl={3}
              >
                Search Results: {query}
              </Heading>
            </Flex>
            
            {searchResults.length > 0 ? (
              <Box
                sx={{
                  columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                  columnGap: { base: 3, md: 4, lg: 5 },
                }}
              >
                {searchResults.map((item, index) => (
                  <Box key={`${item?.id ?? "game"}-${index}`} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
                    <GameItem
                      data={item}
                      locale={locale}
                      channel={searchParams?.channel}
                    />
                  </Box>
                ))}
              </Box>
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
      <Footer />
    </Box>
  );
}