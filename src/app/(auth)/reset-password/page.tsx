import { Suspense } from "react";
import { ResetPasswordClient } from "./ResetPasswordClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Reset Password — PrismFlow AI" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordClient />
    </Suspense>
  );
}
