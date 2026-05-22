import { DonationForm } from "@/components/public/donation-form";
import { donateForm } from "@/lib/content";

export const metadata = { title: donateForm.title };

export default function DonatePage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-3xl font-bold">{donateForm.title}</h1>
        <p className="text-muted-foreground">{donateForm.subtitle}</p>
      </div>
      <DonationForm />
    </section>
  );
}
