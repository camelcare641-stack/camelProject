import type { Metadata } from "next";
import { SettingsForm } from "@/features/admin/components/settings-form";
import { getSiteSettingsRaw } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Тохиргоо",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsRaw();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Тохиргоо</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Сайтын тохиргоо
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Холбоо барих, дансны болон байгууллагын мэдээллийг энд засна. Хадгалсны
            дараа нийтийн хуудсууд шинэчлэгдэнэ.
          </p>
        </div>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <SettingsForm initial={settings} />
        </div>
      </div>
    </section>
  );
}
