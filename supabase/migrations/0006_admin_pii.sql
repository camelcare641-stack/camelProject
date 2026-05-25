-- Close the donations PII leak.
--
-- The public SELECT policy on `donations` is `using (true)` so the donation
-- modal can watch its own row's `status` over Realtime (filter id=eq.<id>).
-- But that also let any anon/authenticated client read every donor's
-- name / email / phone / message.
--
-- RLS can't restrict *columns*, so we keep the row policy and use
-- column-level privileges: revoke blanket SELECT, then grant SELECT only on
-- the non-PII columns the modal/marquee need. The admin panel reads full rows
-- through the service-role client, which bypasses both RLS and column grants.

revoke select on public.donations from anon, authenticated;

grant select (id, status, amount, created_at, paid_at, qpay_invoice_id)
  on public.donations to anon, authenticated;
