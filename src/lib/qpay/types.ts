// QPay v2 merchant API request/response types.
// Field shapes follow QPay docs as of writing — verify against your merchant docs.

export interface QPayAuthResponse {
  token_type: string;
  refresh_expires_in: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  "not-before-policy": number;
  session_state: string;
}

export interface QPayCreateInvoiceRequest {
  invoice_code: string;
  sender_invoice_no: string;
  invoice_receiver_code: string;
  invoice_description: string;
  amount: number;
  callback_url: string;
  // Optional metadata blocks the QPay merchant docs describe (sender data, lines, etc.).
  // TODO: extend with the exact fields your merchant agreement allows.
}

export interface QPayInvoiceUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayCreateInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string; // base64 PNG
  qPay_shortUrl: string;
  urls: QPayInvoiceUrl[];
}

export interface QPayCheckPaymentRequest {
  object_type: "INVOICE";
  object_id: string; // invoice_id
  offset?: { page_number?: number; page_limit?: number };
}

export interface QPayPaymentRow {
  payment_id: string;
  payment_status: "PAID" | "REFUNDED" | "FAILED" | "NEW";
  payment_amount: number;
  payment_currency: string;
  payment_wallet: string;
  payment_name?: string;
  payment_description?: string;
  paid_by?: string;
  object_type: string;
  object_id: string;
  payment_date?: string;
}

export interface QPayCheckPaymentResponse {
  count: number;
  paid_amount: number;
  rows: QPayPaymentRow[];
}

export interface QPayCallbackPayload {
  // Sent by QPay to QPAY_CALLBACK_URL when an invoice transitions to PAID.
  // TODO: confirm the exact shape against your merchant docs.
  object_id?: string;
  payment_id?: string;
  payment_status?: string;
  payment_amount?: number;
  [k: string]: unknown;
}

export type QPayError = {
  error: string;
  message?: string;
};
