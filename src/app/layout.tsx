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

export const metadata: Metadata = {
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
