export const runtime = "edge";

import { getCategories } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
} from "@chakra-ui/react";

interface Props {
  params: {
    locale: Locale;
  };
}

import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function TermsOfServicePage({
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
              Terms of Service
            </Heading>
            
            <Text fontSize="sm" color="gray.500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>

            <Text fontSize="md" lineHeight="tall">
              Welcome to <strong>{siteName}</strong>! These terms and conditions outline the rules and regulations for the use of {siteName}&apos;s Website, located at {normalizedBaseUrl}.
            </Text>
            <Text fontSize="md" lineHeight="tall">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use {siteName} if you do not agree to take all of the terms and conditions stated on this page.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              License
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Unless otherwise stated, {siteName} and/or its licensors own the intellectual property rights for all material on {siteName}. All intellectual property rights are reserved. You may access this from {siteName} for your own personal use subjected to restrictions set in these terms and conditions.
            </Text>
            <Text fontSize="md" lineHeight="tall">You must not:</Text>
            <Box pl={4}>
              <Text mb={2}>• Republish material from {siteName}</Text>
              <Text mb={2}>• Sell, rent or sub-license material from {siteName}</Text>
              <Text mb={2}>• Reproduce, duplicate or copy material from {siteName}</Text>
              <Text mb={2}>• Redistribute content from {siteName}</Text>
            </Box>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Hyperlinking to our Content
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              The following organizations may link to our Website without prior written approval:
            </Text>
            <Box pl={4}>
              <Text mb={2}>• Government agencies;</Text>
              <Text mb={2}>• Search engines;</Text>
              <Text mb={2}>• News organizations;</Text>
              <Text mb={2}>• Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</Text>
            </Box>

            <Heading as="h2" size="lg" color="white" mt={4}>
              iFrames
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Content Liability
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Disclaimer
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.
            </Text>
            <Text fontSize="md" lineHeight="tall">
              As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
            </Text>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}