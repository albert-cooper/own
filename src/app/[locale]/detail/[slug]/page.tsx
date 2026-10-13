import { buildPageMetadata, catalogLocale } from "@/lib/seo";
import { availableLocalesFor } from "@/services/seo-catalog";
import { getGame } from "@/services/catalog";
import GameGrid from "@/components/game-grid";
import { getSiteConfig } from "@/config/site";

import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaCirclePlay } from "react-icons/fa6";
import { getCategories, getGames } from "@/actions";
import PageShell from "@/components/page-shell";
import Info from "@/components/info";
import StarRating from "@/components/star-rating";
import { Locale } from "@/i18n/routing";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { getTargetHref, randomGames} from "@/utils";
const AdPair = dynamic(() => import("@/components/ads/ad-pair"), { ssr: false });
interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}
const getLikes = () => {
  const min = 3;
  const max = 5;
  const number = Math.random() * (max - min) + min;
  return parseFloat(number.toFixed(1)); // 保留一位小数
};
export async function generateMetadata({ params: { locale, slug } }: Props) {
  const game = await getGame(locale, slug);
  const path = `/detail/${encodeURIComponent(String(game.id))}`;
  return buildPageMetadata({ locale, path, title: game.name,
    description: game.description || game.name,
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
  const game = allGames.find((item) => item.id.toString() === slug);
  if (!game) {
    return notFound();
  }

  const category = categories.find((item) => item.id === game.categoryId);

  const categoryByGames = allGames.filter(
    (item) => item.categoryId === category?.id && String(item.id) !== slug
  );
  const typeGames = randomGames(categoryByGames.length, 18).map((item) => categoryByGames[item]);

  if (!category) {
    return notFound();
  }
  return (
    <PageShell hostname={hostname} categories={categories}>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} pt={{ base: 4, md: 6 }}>
        <AdPair />
      </Container>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <SimpleGrid as="article" aria-labelledby="game-title" lang={catalogLocale(locale)} columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6, lg: 10 }}>
          <Box>
            <AspectRatio
              ratio={{ base: 16 / 9, md: 1 }}
              rounded={{ base: "xl", md: "2xl" }}
              overflow="hidden"
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              boxShadow="2xl"
            >
              <Image
                alt={game.name}
                width={600}
                height={600}
                src={game.image}
                priority={false}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AspectRatio>
          </Box>
          <Box
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            rounded={{ base: "xl", md: "2xl" }}
            p={{ base: 4, md: 6 }}
            boxShadow="2xl"
          >
            <Heading as="h1" id="game-title" size={{ base: "md", md: "lg" }} lineHeight={1.25} color="white">
              {game.name}
            </Heading>
            <Box pt={3}>
              <StarRating size="12px" rating={getLikes()} color="#ffaa25" />
            </Box>
            <Flex gap={2} pt={3} alignItems="center">
              <Box fontSize="2xs" color="gray.400">
                BY
              </Box>
              <Tag fontSize="2xs" size="sm" rounded="full" colorScheme="cyan" variant="solid">
                {category?.name}
              </Tag>
            </Flex>
            <Box pt={{ base: 4, md: 5 }}>
              <Button
                colorScheme="cyan"
                size="lg"
                w="full"
                rounded="full"
                as="a"
                rel="noopener noreferrer"
                href={getTargetHref(locale, `/play/${slug}`, searchParams?.channel)}
                rightIcon={<FaCirclePlay />}
                _hover={{ transform: "scale(1.02)", boxShadow: "0 0 15px rgba(0,255,255,0.4)" }}
                transition="all 0.2s"
              >
                {t("Play")}
              </Button>
            </Box>
            <Heading as="h2" size="md" pt={{ base: 6, md: 7 }} pb={3} color="white">
              {t("Introduction")}
            </Heading>
            <Text color="gray.300" lineHeight="tall">{game.description}</Text>
          </Box>
        </SimpleGrid>
      </Container>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} pb={{ base: 4, md: 6 }}>
        <Box as="section" aria-labelledby="similar-games" mb={6}>
          <Heading as="h2" id="similar-games" size="lg" mb={4} color="white" borderLeft="4px solid" borderColor="cyan.400" pl={3}>
            {t("SimilarGames")}
          </Heading>
          <GameGrid games={typeGames} locale={locale} channel={searchParams?.channel} />
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
      </Container>
    </PageShell>
  );
}
