import Image from "next/image";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/features/admin/actions";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { AdminMobileBar } from "@/features/admin/components/admin-mobile-bar";
import { Button } from "@/components/ui/button";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Panel pages render PII (messages, donations) via the service-role client,
  // so unauthenticated visitors must never reach them. The login route lives
  // outside this group, so this redirect can't loop.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image
            src="/logo-mark.png"
            alt=""
            width={34}
            height={34}
            className="h-[34px] w-[34px] object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight text-charcoal">
              ТЭМЭЭ
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-charcoal-muted">
              Удирдлага
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <AdminNav />
        </div>

        <div className="border-t border-border px-4 py-4">
          <p className="mb-2 truncate text-xs text-charcoal-muted">
            {user.email}
          </p>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              <LogOut className="size-4" />
              Гарах
            </Button>
          </form>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-col">
        <AdminMobileBar email={user.email} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
