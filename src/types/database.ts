// Hand-typed mirror of the Supabase schema in supabase/migrations/0001_schema.sql.
// Regenerate with `supabase gen types typescript` once the project is linked.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DonationStatus = "pending" | "paid" | "failed";

export interface BankAccountInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
  currency?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  story: string;
  goals: string[];
  advantages: string[];
  goal_amount: number;
  bank_account_info: BankAccountInfo | null;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number;
  message: string | null;
  is_anonymous: boolean;
  qpay_invoice_id: string | null;
  qpay_payment_id: string | null;
  status: DonationStatus;
  created_at: string;
  paid_at: string | null;
}

export interface PublicDonation {
  donor_name: string;
  amount: number;
  message: string | null;
  paid_at: string;
}

export interface CampaignStats {
  total_raised: number;
  donor_count: number;
  goal_amount: number;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  sort_order: number;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      campaign: {
        Row: Campaign;
        Insert: Omit<Campaign, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Campaign>;
        Relationships: [];
      };
      donations: {
        Row: Donation;
        Insert: Omit<Donation, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Donation>;
        Relationships: [];
      };
      partners: {
        Row: Partner;
        Insert: Omit<Partner, "id"> & { id?: string };
        Update: Partial<Partner>;
        Relationships: [];
      };
      news: {
        Row: News;
        Insert: Omit<News, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<News>;
        Relationships: [];
      };
    };
    Views: {
      public_donations: { Row: PublicDonation; Relationships: [] };
      campaign_stats: { Row: CampaignStats; Relationships: [] };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
    Enums: { donation_status: DonationStatus };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    CompositeTypes: {};
  };
}
