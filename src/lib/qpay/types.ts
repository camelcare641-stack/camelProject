// QPay v2 merchant API — minimal types for the donation flow.
// Source: https://developer.qpay.mn/

export type QPayTokenResponse = {
  token_type: string;
  refresh_expires_in: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  not_before_policy: string;
  session_state: string;
};

export type CreateInvoiceInput = {
  invoiceCode: string;
  senderInvoiceNo: string;
  invoiceReceiverCode: string;
  description: string;
  amount: number;
  callbackUrl: string;
};

export type QPayInvoiceResponse = {
  invoice_id: string;
  qr_text: string;
  qr_image: string;          // base64 PNG without data URI prefix
  qPay_shortUrl: string;
  urls: {
    name: string;
    description: string;
    logo: string;
    link: string;
  }[];
};

export type QPayPayment = {
  payment_id: string;
  payment_status: "NEW" | "FAILED" | "PAID" | "REFUNDED";
  payment_date: string;
  payment_fee: string;
  payment_amount: string;
  payment_currency: string;
  payment_wallet: string;
  transaction_type: string;
};

export type QPayPaymentCheckResponse = {
  count: number;
  paid_amount: number;
  rows: QPayPayment[];
};
