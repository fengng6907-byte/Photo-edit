import type { Metadata } from "next";
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = { title: "Filter Marketplace" };

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
