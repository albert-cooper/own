"use client";
import type { SiteConfig } from "@/config/site";

import dayjs from "dayjs";

import { Box, Container, Text, Flex, Link } from "@chakra-ui/react";
import BackToTop from "./back-to-top";
import { getTargetHref } from "@/utils";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

export default function FooterClient({ site }: { site: SiteConfig }) {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel");

  const hostname = site.name;

  return (
    <>
      <Box as="footer" w="full" bg="gray.800" borderTop="1px solid" borderColor="gray.700">
        <Container maxW="container.xl" p={{ base: 4, md: 6, lg: 8 }}>
          <Flex 
            flexDirection={{ base: "column", md: "row" }} 
            justifyContent="space-between" 
            alignItems="center"
            gap={4}
          >
            <Text textAlign={{ base: "center", md: "left" }} color="gray.400">
              © {dayjs().format("YYYY")} {hostname}. All rights reserved.
            </Text>
            
            <Flex gap={{ base: 4, md: 6 }} flexWrap="wrap" justifyContent="center">
              <Link href={getTargetHref(locale, "/about", channel)} color="gray.400" _hover={{ color: "cyan.400" }} fontSize="sm">
                About Us
              </Link>
              <Link href={getTargetHref(locale, "/privacy-policy", channel)} color="gray.400" _hover={{ color: "cyan.400" }} fontSize="sm">
                Privacy Policy
              </Link>
              <Link href={getTargetHref(locale, "/terms-of-service", channel)} color="gray.400" _hover={{ color: "cyan.400" }} fontSize="sm">
                Terms of Service
              </Link>
              <Link href={getTargetHref(locale, "/contact", channel)} color="gray.400" _hover={{ color: "cyan.400" }} fontSize="sm">
                Contact Us
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <BackToTop />
    </>
  );
}
