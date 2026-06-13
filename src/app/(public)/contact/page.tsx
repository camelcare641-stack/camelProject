import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/features/contact/components/contact-form";
import { FAQ } from "@/features/contact/components/faq";
import { getFaqs } from "@/features/contact/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: site.description,
};

export const revalidate = 60;

export default async function ContactPage() {
  const [settings, faqRows] = await Promise.all([getSiteSettings(), getFaqs()]);
  const { contactInfo } = settings;
  const faqs = faqRows.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      {/* Pass `image` later (e.g. a static path or settings field) to swap the
          light-brown band for a photo hero. */}
      <PageHero
        eyebrow="Холбоо"
        title="Холбоо барих"
        lead="Санал, асуулт, хамтын ажиллагааны хүсэлтээ доорх маягтаар бидэнд илгээгээрэй."
        variant="brand"
        image={null}
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-4">
            <p className="eyebrow">Бидэнтэй холбогдох</p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                  Утас
                </dt>
                <dd className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                  {contactInfo.phone}
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                  И-мэйл
                </dt>
                <dd className="mt-1.5 font-display text-lg font-semibold text-charcoal">
                  {contactInfo.email}
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                  Хаяг
                </dt>
                <dd className="mt-1.5 text-base text-charcoal">{contactInfo.address}</dd>
              </div>
            </dl>
            <p className="mt-8 font-display text-lg italic text-charcoal-muted">
              &ldquo;{settings.slogan}&rdquo;
            </p>
          </aside>

          <div className="lg:col-span-8">
            <p className="eyebrow">Маягт</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-charcoal sm:text-3xl">
              Зурвас илгээх
            </h2>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">Тусламж</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Түгээмэл асуулт
          </h2>
          <div className="mt-8">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
