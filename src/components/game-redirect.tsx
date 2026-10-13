"use client";

import { useEffect, useRef } from "react";
import {Box} from '@chakra-ui/react';

export default function RedirectPlay({ url }: { url: string }) {
  const ref = useRef<HTMLAnchorElement| null>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, [])

  return (
    <Box as="main" p={6} lang="en-US">
      <h1>Opening game</h1>
      <Box as="a" ref={ref} href={url} rel="nofollow noopener noreferrer">Continue to game</Box>
    </Box>
  );
}