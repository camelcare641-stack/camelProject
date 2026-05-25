import { Hero } from "@/features/home/components/hero";
import { AboutSummary } from "@/features/home/components/about-summary";
import { CamelSection } from "@/features/home/components/camel-section";
import { NewsSection } from "@/features/home/components/news-strip";
import { TestimonialsSection } from "@/features/home/components/testimonials";
import { DonateSection } from "@/features/donate/components/donate-section";
import { getTestimonials } from "@/features/home/queries";
import { getNews } from "@/features/news/queries";

export const revalidate = 30;

export default async function HomePage() {
  const [news, testimonials] = await Promise.all([
    getNews(8),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <div id="why">
        <AboutSummary />
      </div>
      <div id="camel">
        <CamelSection />
      </div>
      <NewsSection news={news} />
      <TestimonialsSection items={testimonials} />
      <DonateSection />
    </>
  );
}
