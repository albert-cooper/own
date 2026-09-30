"use client";

import { useEffect, useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa6";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件，控制按钮显隐
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 点击回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="30px"
      right={{ base: "20px", md: "40px" }}
      zIndex={999}
    >
      <IconButton
        aria-label="Back to top"
        icon={<FaArrowUp />}
        onClick={scrollToTop}
        colorScheme="cyan"
        rounded="full"
        size="lg"
        boxShadow="0 4px 12px rgba(0, 255, 255, 0.3)"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: "0 6px 16px rgba(0, 255, 255, 0.5)",
        }}
        transition="all 0.2s"
      />
    </Box>
  );
}
