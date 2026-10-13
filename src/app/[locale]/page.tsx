import { getSiteConfig } from "@/config/site";
 



import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  SimpleGrid,
  Flex,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
    <Box bg="gray.900" minH="100vh">
      <Header hostname={hostname} categories={categories} />
      <Container
        maxWidth="container.xl"
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <AdPair>
{adInsertedGame && (
            <Box w={{ base: "320px", md: "100%" }} maxW="728px" mb="8px">
              <GameItem
                data={adInsertedGame}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          )}
                  </AdPair>
        <VStack alignItems="stretch" gap={{ base: 8, md: 12 }} mt={6}>
          <Box>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Heading
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
            <Box
              sx={{
                columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                columnGap: { base: 3, md: 4, lg: 5 },
              }}
            >
              {newGames.map((item) => (
                <Box key={item?.id} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
                  <GameItem
                    data={item}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Heading
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
            <Box
              sx={{
                columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                columnGap: { base: 3, md: 4, lg: 5 },
              }}
            >
              {topGames.map((item) => (
                <Box key={item?.id} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
                  <GameItem
                    data={item}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {categories.map((category) => {
            const games = allGames.filter((game) => game.categoryId === category.id);
            const gamesList = randomGames(games.length, 12).map((item) => games[item]);
            if (!gamesList.length) {
              return null;
            }

            return (
              <Box key={category.alias}>
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
                    <Heading
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
                <Box
                  sx={{
                    columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                    columnGap: { base: 3, md: 4, lg: 5 },
                  }}
                >
                  {gamesList.map((item) => (
                    <Box key={item?.id} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
                      <GameItem
                        data={item}
                        locale={locale}
                        channel={searchParams?.channel}
                      />
                    </Box>
                  ))}
                </Box>
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
      <Footer />
    </Box>
  );
}
