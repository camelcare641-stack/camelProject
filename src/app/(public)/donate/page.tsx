import type { Metadata } from "next";
import { site } from "@/lib/content";
import { DonateSection } from "@/features/donate/components/donate-section";

export const metadata: Metadata = {
  title: "Хандив өгөх",
  description: `${site.fullName} — дансаар хандив өгөх заавар.`,
};

export default function DonatePage() {
  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <p className="eyebrow">Хандив</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-balance text-charcoal sm:text-6xl">
            Хандив өгөх
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-muted">
            Та QPay-ээр эсвэл дансаар шилжүүлэн хандив өгөх боломжтой.
            Дээрх <strong className="text-charcoal">Хандив өгөх</strong> товчийг
            дарвал QPay-ээр шууд төлбөр хийх боломжтой; доорх дансны мэдээллээр
            банкны аппаараа шилжүүлэг хийж болно.
          </p>
        </div>
      </section>

      <DonateSection />
    </>
  );
}
