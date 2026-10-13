import { getSiteConfig } from "@/config/site";
import FooterClient from "./footer-client";

export default function Footer() {
  return <FooterClient site={getSiteConfig()} />;
}
