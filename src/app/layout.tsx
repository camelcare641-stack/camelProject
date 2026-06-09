import type { Metadata, Viewport } from "next";
import { Alegreya, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/content";
import "./globals.css";

const alegreya = Alegreya({
  subsets: ["latin", "cyrillic"],
  variable: "--font-alegreya",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

// Absolute base for OG/Twitter image URLs. Prefer an explicit production URL,
// fall back to Vercel's auto-injected production domain, then localhost in dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Shared social-share image. Reuses the existing camel-charm photo.
const ogImage = {
  url: "/camel-charm.png",
  width: 1122,
  height: 1402,
  alt: site.hook,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.fullName,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.fullName,
    description: site.description,
    type: "website",
    locale: "mn_MN",
    siteName: site.name,
    url: "/",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description: site.description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="mn"
      data-scroll-behavior="smooth"
      className={`${alegreya.variable} ${manrope.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-white text-charcoal">
        <a href="#main" className="skip-link">
          Гол агуулга руу шилжих
        </a>
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
