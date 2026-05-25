import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Reads for restricted tables (messages has no public read; donations PII is
// locked from the public client) go through the service-role client. All
// callers are admin server components rendered behind the layout auth guard.

export type AdminMessage = {
  id: string;
  name: string;
  contact: string;
  topic: string | null;
  body: string;
  created_at: string;
};

export type AdminDonation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  anonymous: boolean;
  amount: number;
  status: string;
  shipping_status: string;
  created_at: string;
  paid_at: string | null;
};

export async function getMessages(): Promise<AdminMessage[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, contact, topic, body, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getMessages", error);
    return [];
  }
  return (data ?? []) as AdminMessage[];
}

export async function getDonations(): Promise<AdminDonation[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("donations")
    .select(
      "id, name, email, phone, message, anonymous, amount, status, shipping_status, created_at, paid_at",
    )
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getDonations", error);
    return [];
  }
  return (data ?? []) as AdminDonation[];
}

export type AdminPartner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
};

export type AdminTestimonial = {
  id: string;
  author: string;
  role: string | null;
  body: string;
  photo_url: string | null;
  sort_order: number;
};

export async function getAdminPartners(): Promise<AdminPartner[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAdminPartners", error);
    return [];
  }
  return (data ?? []) as AdminPartner[];
}

export async function getAdminTestimonials(): Promise<AdminTestimonial[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author, role, body, photo_url, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAdminTestimonials", error);
    return [];
  }
  return (data ?? []) as AdminTestimonial[];
}

export type AdminDonor = {
  id: string;
  name: string;
  amount: number;
  created_at: string;
};

export async function getAdminDonors(): Promise<AdminDonor[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("donors")
    .select("id, name, amount, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAdminDonors", error);
    return [];
  }
  return (data ?? []) as AdminDonor[];
}

export type AdminStats = {
  news: number;
  partners: number;
  testimonials: number;
  donors: number;
  donorTotal: number;
  messages: number;
  donations: number;
  pendingShipments: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient();

  const headCount = (table: string) =>
    supabase.from(table).select("*", { count: "exact", head: true });

  const [news, partners, testimonials, donorsRows, messages, donations, shipments] =
    await Promise.all([
      headCount("news"),
      headCount("partners"),
      headCount("testimonials"),
      supabase.from("donors").select("amount"),
      headCount("messages"),
      headCount("donations"),
      supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid")
        .in("shipping_status", ["pending_address", "addressed"]),
    ]);

  const donorTotal = (donorsRows.data ?? []).reduce(
    (sum, row: { amount: number }) => sum + (row.amount || 0),
    0,
  );

  return {
    news: news.count ?? 0,
    partners: partners.count ?? 0,
    testimonials: testimonials.count ?? 0,
    donors: donorsRows.data?.length ?? 0,
    donorTotal,
    messages: messages.count ?? 0,
    donations: donations.count ?? 0,
    pendingShipments: shipments.count ?? 0,
  };
}
