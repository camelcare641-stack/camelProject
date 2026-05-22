import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { admin, site } from "@/lib/content";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="text-lg font-bold">
            {site.name} · {admin.dashboardTitle}
          </Link>
          {user ? (
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="hover:underline">
                {admin.dashboardTitle}
              </Link>
              <Link href="/admin/campaign" className="hover:underline">
                {admin.manageCampaign}
              </Link>
              <Link href="/admin/donations" className="hover:underline">
                {admin.manageDonations}
              </Link>
              <Link href="/admin/partners" className="hover:underline">
                {admin.managePartners}
              </Link>
              <Link href="/admin/news" className="hover:underline">
                {admin.manageNews}
              </Link>
              <SignOutButton />
            </nav>
          ) : null}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

