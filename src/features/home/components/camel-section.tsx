import Image from "next/image";
import { DonateCTA } from "@/components/site/donate-cta";

/**
 * §3 of the home funnel — the conversion heart.
 * Studio shot + three claim columns. Lifestyle shot slot is a placeholder
 * until the org delivers the photo (PROJECT.md §18).
 */
export function CamelSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">&quot;Тэмээ&quot; гэж юу вэ?</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-5xl">
            Гар урлалын бэлгэдэл, нэг хүүхдийн ирээдүйг гэрэлтүүлнэ.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Photos column */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/camel-charm.png"
                alt="Бэлгэдлийн тэмээ — гар урлалын арьсан бүтээгдэхүүн"
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div
              aria-label="Тэмээний амьдралын ажиглалтын зураг — удахгүй"
              className="flex aspect-square items-center justify-center border border-dashed border-border bg-paper px-4 text-center text-[11px] uppercase tracking-[0.1em] text-charcoal-muted"
            >
              [Lifestyle photo — coming soon]
            </div>
          </div>

          {/* Claim columns */}
          <div className="grid gap-8 lg:col-span-6">
            <Claim
              title="Гар урлалын бүтээгдэхүүн"
              body="Гараар урлан хийсэн цүнх, түлхүүрний оосор."
            />
            <Claim
              title="25,000₮ = Нэг хүүхдийн боломж"
              body="Нэг хүүхдийн сургалт, сэтгэлзүйн зөвлөгөө, хөгжлийн үйл ажиллагаа, хамгааллын үйлчилгээ, урлаг спортын оролцоонд хүрэх дэмжлэг."
            />
            <Claim
              title="Зүүсэн хүний үнэ цэн"
              body="Ижил зорилготой хүмүүсийн хүрээлэлд нэгдэнэ."
            />

            <p className="text-xs leading-relaxed text-charcoal-muted">
              25,000₮ ба түүнээс дээш хандивлавал бид таны тэмээг хүргэж болно.
            </p>

            <div>
              <DonateCTA size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Claim({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-clay pl-5">
      <h3 className="font-display text-lg font-bold text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{body}</p>
    </div>
  );
}
