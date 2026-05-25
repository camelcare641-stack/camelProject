import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/features/admin/actions";
import { AdminNav } from "@/features/admin/components/admin-nav";
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
    <div className="min-h-[60vh] bg-paper">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <AdminNav />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-charcoal-muted sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Гарах
              </Button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
