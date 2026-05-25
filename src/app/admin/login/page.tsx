import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/admin/components/login-form";

export const metadata: Metadata = {
  title: "Удирдлагын нэвтрэлт",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="border border-border bg-white p-8 sm:p-10">
          <p className="eyebrow">Удирдлага</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-charcoal">
            Нэвтрэх
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Зөвхөн админ нэвтэрнэ үү.
          </p>
          <div className="mt-7">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
