 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  SimpleGrid,
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

import Header from "@/components/header";
import Footer from "@/components/footer";
import Info from "@/components/info";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { randomGames } from "@/utils";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })


export default async function Page({
  params: { locale, slug },
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
  const category = categories.find((item) => item.alias === slug);

  if (!category) {
    return notFound();
  }

  const _list = allGames.filter(
    (item) => item.categoryId === category.id 
  );
  const categoryByGames = randomGames(_list.length, 8).map((item) => _list[item]);

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
          {categoryByGames[0] && (
            <Box w={{ base: "320px", md: "100%" }} maxW="728px" mb="8px">
              <GameItem
                data={categoryByGames[0]}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          )}
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
                borderColor="orange.400"
                pl={3}
              >
                {t("Games", { category: category.name })}
              </Heading>
            </Flex>
            <Box
              sx={{
                columnCount: { base: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                columnGap: { base: 3, md: 4, lg: 5 },
              }}
            >
              {categoryByGames.slice(1).map((item, index) => (
                <Box key={`${item?.id ?? "game"}-${index}`} sx={{ breakInside: "avoid", mb: { base: 3, md: 4, lg: 5 } }}>
                  <GameItem
                    data={item}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                </Box>
              ))}
            </Box>
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
