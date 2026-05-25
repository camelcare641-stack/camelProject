import { Footer } from "@/components/site/footer";
import { SupportBar } from "@/components/site/support-bar";

export const revalidate = 30;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <Footer />
      <SupportBar />
    </>
  );
}
