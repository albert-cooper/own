export const runtime = "edge";

import { getCategories } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  VStack,
  Heading,
  Box,
  Text,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface Props {
  params: {
    locale: Locale;
  };
}

import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function ContactPage({
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
  
  const categories = await getCategories(locale);

  return (
    <Box bg="gray.900" minH="100vh" color="gray.300">
      <Header categories={categories} hostname={hostname} />
      <Container maxWidth="container.md" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        <Box bg="gray.800" p={{ base: 6, md: 10 }} rounded="2xl" border="1px solid" borderColor="gray.700" boxShadow="xl">
          <VStack align="stretch" spacing={6} gap={6}>
            <Heading as="h1" size="2xl" color="white" mb={2}>
              Contact Us
            </Heading>
            
            <Text fontSize="md" lineHeight="tall">
              Have a question, feedback, or a business inquiry? We&apos;d love to hear from you! Please fill out the form below or reach out to us directly.
            </Text>

            <Box mt={4} p={6} bg="gray.750" rounded="xl" border="1px solid" borderColor="gray.600">
              <VStack spacing={4} gap={4}>
                <FormControl id="name">
                  <FormLabel color="gray.300">Name</FormLabel>
                  <Input type="text" bg="gray.800" borderColor="gray.600" _hover={{borderColor: 'cyan.400'}} _focus={{borderColor: 'cyan.400', boxShadow: 'none'}} />
                </FormControl>
                
                <FormControl id="email">
                  <FormLabel color="gray.300">Email Address</FormLabel>
                  <Input type="email" bg="gray.800" borderColor="gray.600" _hover={{borderColor: 'cyan.400'}} _focus={{borderColor: 'cyan.400', boxShadow: 'none'}} />
                </FormControl>
                
                <FormControl id="message">
                  <FormLabel color="gray.300">Message</FormLabel>
                  <Textarea rows={6} bg="gray.800" borderColor="gray.600" _hover={{borderColor: 'cyan.400'}} _focus={{borderColor: 'cyan.400', boxShadow: 'none'}} />
                </FormControl>
                
                <Button colorScheme="cyan" size="lg" w="full" mt={4} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} transition="all 0.2s">
                  Send Message
                </Button>
              </VStack>
            </Box>

            <Box mt={6} pt={6} borderTop="1px solid" borderColor="gray.700">
              <Heading as="h3" size="md" color="white" mb={4}>
                Other Ways to Reach Us
              </Heading>
              <Text fontSize="md">
                <strong>Email:</strong> support@{hostname}
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}