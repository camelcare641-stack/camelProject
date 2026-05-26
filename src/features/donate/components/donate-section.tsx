import { site } from "@/lib/content";
import { getSiteSettings } from "@/features/settings/queries";
import { CopyButton } from "@/features/donate/components/copy-button";
import { DonorForm } from "@/features/donate/components/donor-form";

/**
 * §5 of the home page funnel — also rendered as the body of the /donate
 * route. The bank-transfer fallback for donors who don't use QPay.
 */
export async function DonateSection() {
  const { bank } = await getSiteSettings();
  return (
    <section id="donate" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">Өөр сонголт</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Дансаар шилжүүлэх
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal-muted">
            QPay биш, банкны аппаар шилжүүлэх боломжтой. Шилжүүлэг хийсний дараа
            доорх формоор нэрээ бүртгүүлснээр хандивлагчдын жагсаалтад нэгдэнэ.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* Bank info */}
          <div className="border border-border bg-white p-7 sm:p-9 lg:col-span-7">
            <dl className="divide-y divide-border border-y border-border">
              <Row label="Банк" value={bank.name} />
              <Row label="Хүлээн авагч" value={bank.holder} />
              <div className="grid grid-cols-[140px_1fr] gap-4 py-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                  Дансны дугаар
                </dt>
                <dd className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl font-bold text-charcoal break-all">
                    {bank.account}
                  </span>
                  <CopyButton value={bank.account} label="Дансны дугаарыг хуулах" />
                </dd>
              </div>
              <Row label="Нэгж үнэ" value={`${site.unitPrice.toLocaleString("mn-MN")}₮`} />
            </dl>

            <p className="mt-6 border-l-2 border-clay pl-4 text-sm leading-relaxed text-charcoal">
              <span className="font-semibold">Анхаар. </span>
              {bank.note}
            </p>

            <div className="mt-10 border-t border-border pt-7">
              <p className="eyebrow">Нэрээ бүртгүүлэх</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                Шилжүүлэг хийсний дараа нэрээ бүртгүүлснээр хандивлагчдын
                жагсаалтад нэмэгдэнэ.
              </p>
              <DonorForm />
            </div>
          </div>

          {/* QR placeholder */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-white p-7 sm:p-9">
              <p className="eyebrow">QR кодоор төлөх</p>
              <div className="mt-4 flex aspect-square w-full max-w-[260px] items-center justify-center border border-dashed border-border bg-paper text-center text-[11px] uppercase tracking-[0.1em] text-charcoal-muted">
                [REPLACE — QPay / банкны QR зураг]
              </div>
              <p className="mt-4 text-xs leading-relaxed text-charcoal-muted">
                QR кодыг өөрийн банкны аппаар уншуулан шилжүүлэг хийнэ үү.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-4">
      <dt className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">{label}</dt>
      <dd className="text-base font-medium text-charcoal">{value}</dd>
    </div>
  );
}
