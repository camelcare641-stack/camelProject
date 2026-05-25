import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/lib/content";

export function AboutSummary() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-24">
          {/* Row 1 — Problem: text left, image right */}
          <div>
            <p className="eyebrow">Тулгамдсан асуудал</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              Хотын захын олон хүүхэд дэмжлэггүй өсөж байна.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-muted">
              Сэтгэлзүйн дарамт, гэр бүлийн хүчирхийлэл, боловсролын тэгш бус
              байдал, өөртөө итгэх итгэл сул, хөгжлийн боломж хомс, цахим
              болон нийгмийн сөрөг нөлөөлөл — эдгээр нь хотын захын
              хорооллын болон зорилтот бүлгийн хүүхдүүдийн өдөр тутмын бодит
              байдал.
            </p>
            <p className="mt-3 text-base leading-relaxed text-charcoal-muted">
              Тэдэнд зөвхөн материаллаг тусламж бус,{" "}
              <span className="text-charcoal">сэтгэлзүйн дэмжлэг, хөгжлийн
              орчин, хайр халамж, сонсох хүн</span> хамгийн их хэрэгтэй.
            </p>
          </div>
          <ImageSlot label="Асуудлын зураг" />

          {/* Row 2 — Solution: text right, image left on desktop */}
          <div className="lg:order-2">
            <p className="eyebrow">Бидний шийдэл</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              {site.fullName}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-muted">
              Гар урлалын <span className="text-charcoal">&ldquo;Тэмээ&rdquo;</span>{" "}
              бэлэгдэл нь нэг хүүхдийн сургалт, сэтгэлзүйн зөвлөгөө, хөгжлийн
              үйл ажиллагаа, хамгаалал, урлаг спортын оролцоонд хүрэх дэмжлэг.
            </p>
            <dl className="mt-8 flex items-baseline gap-x-6 border-y border-border py-5">
              <dt className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
                25,000₮
              </dt>
              <dd className="text-sm text-charcoal-muted">
                = нэг хүүхдийн боломж
              </dd>
            </dl>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button size="lg" render={<Link href="/donate" />}>
                {cta.donate}
              </Button>
              <Link
                href="/about"
                className="text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
              >
                Дэлгэрэнгүй →
              </Link>
            </div>
          </div>
          <ImageSlot label="Шийдлийн зураг" className="lg:order-1" />
        </div>
      </div>
    </section>
  );
}

function ImageSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      aria-label={`${label} — удахгүй`}
      className={`flex aspect-[4/3] items-center justify-center border border-dashed border-border-strong bg-white px-4 text-center text-[11px] uppercase tracking-[0.1em] text-charcoal-muted${
        className ? ` ${className}` : ""
      }`}
    >
      [{label} — удахгүй]
    </div>
  );
}
