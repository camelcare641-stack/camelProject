import "server-only";
import type {
  CreateInvoiceInput,
  QPayInvoiceResponse,
  QPayPaymentCheckResponse,
  QPayTokenResponse,
} from "./types";

const BASE_URL = process.env.QPAY_BASE_URL!;
const USERNAME = process.env.QPAY_USERNAME!;
const PASSWORD = process.env.QPAY_PASSWORD!;

// Naive in-memory token cache. Tokens are short-lived (typically 1h).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`QPay auth failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as QPayTokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return data.access_token;
}

/**
 * POST to a QPay endpoint with the cached bearer token. If the token was
 * rejected (401) — e.g. it expired earlier than `expires_in` claimed, or this
 * serverless instance held a stale token — clear the cache, re-auth, and retry
 * exactly once before giving up.
 */
async function authedPost(
  path: string,
  body: unknown,
  label: string,
): Promise<Response> {
  const send = async () => {
    const token = await getAccessToken();
    return fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  };

  let res = await send();
  if (res.status === 401) {
    cachedToken = null; // force a fresh token, then retry once
    res = await send();
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`QPay ${label} failed: ${res.status} ${text}`);
  }
  return res;
}

export async function createInvoice(
  input: CreateInvoiceInput,
): Promise<QPayInvoiceResponse> {
  const res = await authedPost(
    "/invoice",
    {
      invoice_code: input.invoiceCode,
      sender_invoice_no: input.senderInvoiceNo,
      invoice_receiver_code: input.invoiceReceiverCode,
      invoice_description: input.description,
      amount: input.amount,
      callback_url: input.callbackUrl,
    },
    "createInvoice",
  );
  return (await res.json()) as QPayInvoiceResponse;
}

export async function checkInvoicePayment(
  invoiceId: string,
): Promise<QPayPaymentCheckResponse> {
  const res = await authedPost(
    "/payment/check",
    {
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    },
    "checkPayment",
  );
  return (await res.json()) as QPayPaymentCheckResponse;
}
