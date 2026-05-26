# Deployment — Vercel + Supabase

> Hosting model: **Vercel** (Next.js app + the QPay callback route) · **Supabase**
> (Postgres, Auth, Storage, Realtime). Two external accounts are also required:
> a **QPay v2** merchant account and an **SMTP** email provider — Vercel/Supabase
> do not cover those.

## Status of the live project

Project ref: `bfzhpxospohzkyenqvje`.

| Item | State |
| --- | --- |
| Tables (`donations`, `donors`, `news`, `messages`, `partners`, `testimonials`) | ✅ present |
| `donations` PII column grants (migration `0006`) | ✅ applied — anon can't read name/email/phone |
| Donate modal "paid" detection | ✅ polls `status` via anon client (column grant allows `id,status`). NB: Realtime `postgres_changes` is dead for anon after `0006`'s `REVOKE SELECT` — confirmed empirically — so the modal polls instead. |
| Storage `media` bucket (public, 5 MB, jpeg/png/webp) + policies | ✅ created |
| `next build` | ✅ clean (all routes compile, TypeScript passes) |
| QPay credentials | ⏳ to configure (sandbox values in `.env`) |
| SMTP provider | ⏳ to configure |

## Environment variables (set in Vercel → Settings → Environment Variables)

See `.env.example` for the full annotated list. App-runtime vars only — the
`SUPABASE_PAT` and `SUPABASE_DB_PASSWORD` are local CLI/migration tools and must
**not** be added to Vercel.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only — never `NEXT_PUBLIC_`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `QPAY_BASE_URL`, `QPAY_USERNAME`, `QPAY_PASSWORD`, `QPAY_INVOICE_CODE`, `QPAY_CALLBACK_URL`

## Go-live checklist

### Now (no QPay/SMTP needed)
- [x] All migrations applied to the prod DB (`0001`–`0006`). **Never** run
      `supabase db push` against live data — `0001` drops tables on re-run.
- [x] Realtime publication includes `donations`.
- [x] `media` storage bucket exists and is public.
- [ ] Add a custom domain in Vercel (needed before wiring QPay — the callback URL
      must be stable; preview URLs change per deploy).
- [ ] Set the Supabase env vars in Vercel and deploy; confirm public pages,
      `/admin/login`, and image upload in the admin all work.

### When QPay is ready
- [ ] Swap `QPAY_BASE_URL` to the **production** QPay base URL and set the real
      `QPAY_USERNAME` / `QPAY_PASSWORD` / `QPAY_INVOICE_CODE`.
- [ ] Set `QPAY_CALLBACK_URL` to the **full** public path including `/api`:
      `https://your-domain.mn/api/qpay/callback`.
      ⚠️ The current `.env` value (`https://example.com/qpay/callback`) is missing
      the `/api` segment — the route lives at `/api/qpay/callback`.
- [ ] Run one real donation and confirm: invoice/QR shows, payment marks the row
      `paid`, the modal flips to success (it polls `status` every 3s), and the
      donor appears in the marquee.

### When SMTP is ready
- [ ] Set the `SMTP_*` vars. Note: nodemailer opens a fresh SMTP connection per
      serverless invocation — works, but a transactional HTTP email API is more
      reliable on Vercel if delivery flakes.
- [ ] Confirm the thank-you email sends after a paid donation and that
      `thank_you_sent_at` is recorded.

## Notes

- `postinstall` copies TinyMCE into `public/tinymce` — runs automatically in the
  Vercel build.
- No cron/background workers are needed; the single QPay callback route handles
  payment confirmation within Vercel's request model.
