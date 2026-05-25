import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Удирдлага",
  robots: { index: false, follow: false },
};

// Pass-through wrapper for the whole /admin area (including /admin/login).
// The authenticated panel + auth guard live in the (panel) route group so
// the login route is never guarded.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
