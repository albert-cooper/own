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

export default async function PrivacyPolicyPage({
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
              Privacy Policy
            </Heading>
            
            <Text fontSize="sm" color="gray.500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>

            <Text fontSize="md" lineHeight="tall">
              At <strong>{siteName}</strong>, accessible from {normalizedBaseUrl}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {siteName} and how we use it.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Information We Collect
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              We collect information to provide better services to all our users. The types of information we collect include:
            </Text>
            <Box pl={4}>
              <Text mb={2}>• <strong>Log Files:</strong> Like many other websites, {siteName} makes use of log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks.</Text>
              <Text mb={2}>• <strong>Cookies and Web Beacons:</strong> We use cookies to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. This information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.</Text>
            </Box>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Google DoubleClick DART Cookie
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to {normalizedBaseUrl} and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" style={{color: '#00B5D8'}}>https://policies.google.com/technologies/ads</a>
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Our Advertising Partners
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense and Google Ad Exchange. Each of our advertising partners has their own Privacy Policy for their policies on user data.
            </Text>
            <Text fontSize="md" lineHeight="tall">
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {siteName}, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </Text>
            <Text fontSize="md" lineHeight="tall">
              Note that {siteName} has no access to or control over these cookies that are used by third-party advertisers.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              CCPA Privacy Rights (Do Not Sell My Personal Information)
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Under the CCPA, among other rights, California consumers have the right to:
            </Text>
            <Box pl={4}>
              <Text mb={2}>• Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</Text>
              <Text mb={2}>• Request that a business delete any personal data about the consumer that a business has collected.</Text>
              <Text mb={2}>• Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</Text>
            </Box>
            <Text fontSize="md" lineHeight="tall">
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              GDPR Data Protection Rights
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </Text>
            <Box pl={4}>
              <Text mb={2}>• <strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</Text>
              <Text mb={2}>• <strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</Text>
              <Text mb={2}>• <strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</Text>
              <Text mb={2}>• <strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</Text>
              <Text mb={2}>• <strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</Text>
              <Text mb={2}>• <strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</Text>
            </Box>
            <Text fontSize="md" lineHeight="tall">
              If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Children&apos;s Information
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </Text>
            <Text fontSize="md" lineHeight="tall">
              {siteName} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </Text>

            <Heading as="h2" size="lg" color="white" mt={4}>
              Consent
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </Text>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
