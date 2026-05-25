import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/components/contact-form";
import { FAQ } from "@/features/contact/components/faq";
import { contactInfo, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: site.description,
};

const faqs = [
  {
    q: "Нэг тэмээ хэдэн төгрөг вэ?",
    a: "Нэг тэмээ 25,000₮. Энэ нь нэг хүүхдийн боловсрол, сэтгэлзүйн зөвлөгөө, халамжийн боломжтой тэнцэх хандив юм.",
  },
  {
    q: "Хандив хаашаа очдог вэ?",
    a: 'Бүх хандив "Дадал Тэнцвэр" ТББ-ын дансанд орж, "ТЭМЭЭ" хүүхэд хөгжлийн төслийн сургалт, сэтгэлзүйн зөвлөгөө, халамжийн үйл ажиллагаанд зарцуулагдана.',
  },
  {
    q: "Яаж хандив өгөх вэ?",
    a: "/donate хуудаснаас дансаар шилжүүлэг хийгээд, нэрээ бүртгүүлснээр хандивлагчдын жагсаалтад нэмэгдэнэ. Гүйлгээний утганд нэр + утсаа бичээрэй.",
  },
  {
    q: "Сайн дурын ажилтан болж болох уу?",
    a: "Болно. Холбоо барих маягтаар бидэнтэй холбогдвол сайн дурын хөтөлбөрийн талаар дэлгэрэнгүй мэдээлэл өгөх болно.",
  },
  {
    q: "Байгууллагын түншлэлд хэрхэн оролцох вэ?",
    a: "Корпорацийн нийгмийн хариуцлагын (CSR) хүрээнд хамтран ажиллах, ивээн тэтгэх боломжтой. Сэдвийг 'Хамтын ажиллагаа' гэж тэмдэглэн зурвас илгээгээрэй.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <p className="eyebrow">Холбоо</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-balance text-charcoal sm:text-6xl">
            Холбоо барих
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-muted">
            Санал, асуулт, хамтын ажиллагааны хүсэлтээ доорх маягтаар бидэнд
            илгээгээрэй.
          </p>
        </div>
      </section>

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
              &ldquo;{site.slogan}&rdquo;
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
