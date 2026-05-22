# Donation Website — Foundation

A starting scaffold for a Mongolian nonprofit donation site.

- **Frontend / backend:** Next.js 16 (App Router, TypeScript, `src/` layout)
- **Database / auth / realtime:** Supabase (Postgres, Seoul region)
- **UI:** Tailwind v4 + shadcn/ui
- **Validation:** Zod
- **Payments:** QPay v2 (Mongolian merchant API), wired through Next.js API routes
- **Deploy target:** Vercel
- **User-facing UI:** Mongolian (Cyrillic). Code & comments stay in English.

This repo is **foundation only** — pages render, the schema is real, the QPay
client and webhook are wired, but the business-logic edges (admin CRUD
mutations, exact QPay payload mapping, etc.) are stubbed with `TODO` comments
for you to complete and review.

---

## 1. Prerequisites

- Node.js ≥ 20
- npm (this scaffold was generated with `npm`)
- A Supabase project — sign up at https://supabase.com and create a project in
  the **Seoul (ap-northeast-2)** region.
- A QPay v2 merchant account — apply at https://www.qpay.mn (sandbox creds
  work for local dev).

---

## 2. Install

```bash
npm install
```

---

## 3. Environment

Copy the template and fill in real values:

```bash
cp .env.example .env.local
```

| Variable                          | Where to get it                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase dashboard → Settings → API                                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase dashboard → Settings → API                                              |
| `SUPABASE_SERVICE_ROLE_KEY`       | Supabase dashboard → Settings → API. **Never** prefix with `NEXT_PUBLIC_`.       |
| `QPAY_USERNAME` / `QPAY_PASSWORD` | From your QPay merchant agreement                                                |
| `QPAY_INVOICE_CODE`               | From your QPay merchant agreement                                                |
| `QPAY_BASE_URL`                   | `https://merchant.qpay.mn/v2` (prod) or `https://merchant-sandbox.qpay.mn/v2`    |
| `QPAY_CALLBACK_URL`               | Public HTTPS URL: `https://<your-deployment>/api/qpay/callback`                  |

For local QPay testing you need a public callback URL. Use `ngrok http 3000`
(or `cloudflared`) and point `QPAY_CALLBACK_URL` at the tunnel.

---

## 4. Database migrations

The schema lives in `supabase/migrations/`. Apply them via the Supabase CLI:

```bash
# one-time
npm i -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF

# apply
supabase db push
```

Or paste each file into Supabase dashboard → SQL Editor in this order:

1. `supabase/migrations/0001_schema.sql` — tables, indexes, views
2. `supabase/migrations/0002_rls.sql` — Row Level Security policies
3. `supabase/migrations/0003_seed.sql` — placeholder campaign + sample content

---

## 5. Create the admin user

The site has no signup — admins are created manually:

```
Supabase dashboard → Authentication → Users → Add user
```

That user can then log in at `/admin/login`.

---

## 6. Run

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm run start  # serve production build
npm run lint
```

---

## 7. Project layout

```
src/
  app/
    (public)/                  ── donor-facing pages
      page.tsx                 ── homepage / campaign
      donate/                  ── donation form + invoice
      transparency/            ── public donation list
      partners/  news/         ── partner grid + news
    admin/                     ── admin panel (auth-gated by middleware)
    api/qpay/                  ── invoice / callback / check
    layout.tsx, globals.css
  components/
    ui/                        ── shadcn primitives
    public/                    ── donor-ticker, donation-form, etc.
    admin/                     ── stats-cards, donations-table
  lib/
    supabase/                  ── client (browser), server (RSC), admin (service role)
    qpay/                      ── client.ts, types.ts
    content.ts                 ── ALL Mongolian UI strings
    validations.ts             ── zod schemas
    utils.ts, admin-auth.ts
  hooks/                       ── use-donations-realtime, use-campaign-stats
  middleware.ts                ── Supabase session refresh + /admin gate
supabase/migrations/           ── 0001 schema, 0002 RLS, 0003 seed
```

---

## 8. Architecture notes

- **Three Supabase clients.** Browser code uses `lib/supabase/client.ts`
  (anon key). Server components / route handlers use `lib/supabase/server.ts`
  (anon key + cookies). The **service-role** `lib/supabase/admin.ts` is
  marked `import "server-only"` and is used **only** by the QPay webhook.
- **QPay webhook is idempotent.** `donations.qpay_payment_id` is `UNIQUE`,
  and the callback narrows its update with `.eq('status', 'pending')` to
  block double-credit if QPay retries.
- **PII never leaks publicly.** The public ticker and transparency page read
  from the `public_donations` view, which exposes only `donor_name, amount,
  message, paid_at` for paid + non-anonymous donations. The raw `donations`
  table has admin-only RLS.
- **Realtime.** The donor ticker subscribes to a broadcast channel
  `donations` on event `paid`. You need to add a Postgres trigger that calls
  `realtime.send(...)` on donation paid — there is a TODO inside
  `src/hooks/use-donations-realtime.ts` with the exact shape.
- **Mongolian UI strings live in one file.** Edit `src/lib/content.ts` to
  change copy; do not hardcode Cyrillic inline in components.

---

## 9. Deploy to Vercel

1. Push the repo to GitHub.
2. Import into Vercel.
3. Set every var from `.env.example` in **Project Settings → Environment Variables**.
4. After the first deploy, copy the production URL and set it as
   `QPAY_CALLBACK_URL` (then redeploy so the runtime picks it up).

---

## 10. What you must finish manually

This scaffold deliberately leaves business-logic edges as `TODO` comments so
you can review them yourself:

- `src/lib/qpay/client.ts` — confirm `createInvoice` payload shape against your
  merchant docs.
- `src/app/api/qpay/callback/route.ts` — confirm callback body shape; optionally
  cross-check `payment_amount` against the donation row.
- `src/app/(public)/donate/[invoiceId]/page.tsx` — wire up QR refetch (either
  cache QR on the donations row when the invoice is created, or call QPay's
  `GET /v2/invoice/{id}`).
- `src/hooks/use-donations-realtime.ts` — add the Postgres trigger described
  there so realtime broadcasts fire on `paid`.
- Admin CRUD pages — server actions + create/edit dialogs for campaign,
  partners, news (validations are already defined in `lib/validations.ts`).
- Privacy policy / Terms pages.
