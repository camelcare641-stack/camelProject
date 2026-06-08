import type { Metadata } from "next";
import { HomeContentForm } from "@/features/admin/components/home-content-form";
import { getHomeContentFlat } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Нүүр хуудас",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const content = await getHomeContentFlat();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Нүүр хуудас</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Нүүр хуудасны агуулга
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Нүүр хуудасны гарчиг, текст болон зургийг энд засна. Хадгалсны дараа
            нүүр хуудас шинэчлэгдэнэ. Талбарыг хоосон үлдээвэл тухайн хэсэг хоосон
            харагдана.
          </p>
        </div>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <HomeContentForm initial={content} />
        </div>
      </div>
    </section>
  );
}
