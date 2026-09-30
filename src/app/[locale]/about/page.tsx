export const runtime = "edge";

import { getCategories } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
  Link,
} from "@chakra-ui/react";

interface Props {
  params: {
    locale: Locale;
  };
}

import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function AboutPage({
  params: { locale },
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
  const siteName = hostname.at(0)?.toUpperCase() + hostname.slice(1);
  
  const categories = await getCategories(locale);

  return (
    <Box bg="gray.900" minH="100vh" color="gray.300">
      <Header categories={categories} hostname={hostname} />
      <Container maxWidth="container.md" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        <Box bg="gray.800" p={{ base: 6, md: 10 }} rounded="2xl" border="1px solid" borderColor="gray.700" boxShadow="xl">
          <VStack align="stretch" spacing={6} gap={6}>
            <Heading as="h1" size="2xl" color="white" mb={2}>
              About Us
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall">
              Welcome to <strong>{siteName}</strong>, your ultimate destination for free online HTML5 games! Our mission is to provide players of all ages with a fun, safe, and engaging environment to enjoy high-quality games without any downloads or installations.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              What We Offer
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              We carefully curate the best games across various categories including Action, Puzzle, Arcade, Racing, and more. Whether you&apos;re looking for a quick brain-teaser during your break or an immersive adventure to spend hours on, we have something for everyone.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Play Anywhere, Anytime
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              All our games are cross-platform compatible. You can play them directly in your web browser on your PC, Mac, smartphone, or tablet. No need to worry about storage space or device compatibility!
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Our Commitment
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              We are committed to providing a secure and enjoyable gaming experience. We regularly update our catalog with new releases and ensure that our platform remains user-friendly and responsive. If you have any feedback or suggestions, feel free to <Link href={`/${locale}/contact`} color="cyan.400">contact us</Link>.
            </Text>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}