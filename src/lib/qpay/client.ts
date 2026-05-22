import "server-only";

import type {
  QPayAuthResponse,
  QPayCheckPaymentResponse,
  QPayCreateInvoiceRequest,
  QPayCreateInvoiceResponse,
} from "./types";

interface CachedToken {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function baseUrl(): string {
  return env("QPAY_BASE_URL").replace(/\/+$/, "");
}

async function qpayFetch<T>(
  path: string,
  init: RequestInit & { auth?: string },
): Promise<T> {
  const { auth, headers, ...rest } = init;
  const res = await fetch(`${baseUrl()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
      ...(headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`QPay ${path} ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

// POST /v2/auth/token with HTTP basic auth (username:password).
// Caches the bearer token until ~30 s before expiry.
export async function authenticate(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 30_000) {
    return cachedToken.accessToken;
  }

  const username = env("QPAY_USERNAME");
  const password = env("QPAY_PASSWORD");
  const basic = Buffer.from(`${username}:${password}`).toString("base64");

  const data = await qpayFetch<QPayAuthResponse>("/v2/auth/token", {
    method: "POST",
    auth: `Basic ${basic}`,
  });

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

// POST /v2/invoice
// TODO: confirm the exact request payload shape against your QPay merchant docs.
export async function createInvoice(
  input: Omit<QPayCreateInvoiceRequest, "invoice_code"> & {
    invoice_code?: string;
  },
): Promise<QPayCreateInvoiceResponse> {
  const token = await authenticate();
  const payload: QPayCreateInvoiceRequest = {
    invoice_code: input.invoice_code ?? env("QPAY_INVOICE_CODE"),
    sender_invoice_no: input.sender_invoice_no,
    invoice_receiver_code: input.invoice_receiver_code,
    invoice_description: input.invoice_description,
    amount: input.amount,
    callback_url: input.callback_url,
  };

  return qpayFetch<QPayCreateInvoiceResponse>("/v2/invoice", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: `Bearer ${token}`,
  });
}

// POST /v2/payment/check — server-side verification of an invoice's payment state.
// Useful when the client polls after the QR is scanned, OR to double-check the webhook.
export async function checkPayment(
  invoiceId: string,
): Promise<QPayCheckPaymentResponse> {
  const token = await authenticate();
  return qpayFetch<QPayCheckPaymentResponse>("/v2/payment/check", {
    method: "POST",
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
    auth: `Bearer ${token}`,
  });
}

// Test helper. Do not call in production code paths.
export function _resetTokenCacheForTests() {
  cachedToken = null;
}
