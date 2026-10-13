"use client";
import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { advertising } from "@/config/advertising";
import AdSlot from "./ad-slot";

export default function AdPair({ children }: PropsWithChildren) {
  return <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
    <AdSlot divId={`${advertising.slotPrefix}-0`} adUnitPath={advertising.adUnitPath}
      sizes={[[320, 100], [320, 50]]} minWidth={320} minHeight={100} style={{ marginBottom: "8px" }} />
    {children}
    <AdSlot divId={`${advertising.slotPrefix}-1`} adUnitPath={advertising.adUnitPath}
      sizes={[[320, 50], [320, 100]]} minWidth={320} minHeight={50} />
  </Box>;
}
