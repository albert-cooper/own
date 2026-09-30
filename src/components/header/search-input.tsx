"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Input, InputGroup, InputLeftElement, InputRightElement, IconButton } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { getTargetHref } from "@/utils";
import { Locale } from "@/i18n/routing";

export default function SearchInput() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // Preserve channel parameter if it exists
    const channel = searchParams.get("channel");
    let url = `/search?q=${encodeURIComponent(query.trim())}`;
    
    router.push(getTargetHref(locale, url, channel));
  };

  return (
    <form onSubmit={handleSearch} style={{ width: "100%" }}>
      <InputGroup size="sm" w="full" maxW={{ base: "100%", md: "240px" }}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.400" size="12px" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="gray.700"
          border="1px solid"
          borderColor="gray.600"
          color="white"
          rounded="full"
          w="full"
          _hover={{ borderColor: "cyan.400" }}
          _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px var(--chakra-colors-cyan-400)" }}
          _placeholder={{ color: "gray.400" }}
        />
      </InputGroup>
    </form>
  );
}
