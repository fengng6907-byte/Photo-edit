import { Suspense } from "react";
import { RegisterClient } from "./RegisterClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Create Account — PrismFlow AI" };

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterClient />
    </Suspense>
  );
}
