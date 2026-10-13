import type { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { CategoryRecord } from "@/services/data";

export default function PageShell({ children, hostname, categories }: PropsWithChildren<{
  hostname: string;
  categories: CategoryRecord[];
}>) {
  return (
    <Box bg="gray.900" minH="100vh" color="gray.300">
      <Header hostname={hostname} categories={categories} />
      <Box as="main" id="main-content" tabIndex={-1}>{children}</Box>
      <Footer />
    </Box>
  );
}
