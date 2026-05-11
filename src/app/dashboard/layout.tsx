import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, subscription_tier, credits_remaining")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-[#0a0828] overflow-hidden">
      <div className="hidden lg:flex flex-col">
        <Sidebar
          user={{
            name: profile?.full_name ?? user.email?.split("@")[0],
            email: user.email,
            tier: profile?.subscription_tier ?? "free",
            creditsRemaining: profile?.credits_remaining ?? 0,
          }}
        />
      </div>
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
