import { Suspense } from "react";
import { LoginClient } from "./LoginClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign In — PrismFlow AI" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
