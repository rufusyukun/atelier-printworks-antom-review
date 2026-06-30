# Payment Live Readiness

This project uses a hosted checkout flow:

1. The storefront creates a server-side order with `/.netlify/functions/orders-create`.
2. The server creates a hosted payment session with `/.netlify/functions/payment-session`.
3. The customer is redirected to the hosted checkout page.
4. Payment notifications are received by `/.netlify/functions/payment-webhook`.
5. Order lookup and the operations dashboard read server-side order records through `/.netlify/functions/orders-get`.

## Required Netlify Environment Variables

Set these in Netlify before enabling live mode:

```text
PAYMENT_MODE=live
SITE_URL=https://atelier-printworks-store.netlify.app

ANTOM_API_BASE_URL=
ANTOM_CREATE_SESSION_PATH=/ams/api/v1/payments/createPaymentSession
ANTOM_CLIENT_ID=
ANTOM_MERCHANT_ID=
ANTOM_PRIVATE_KEY=
ANTOM_PUBLIC_KEY=
ANTOM_KEY_VERSION=1
ANTOM_MERCHANT_REGION=HK

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ORDERS_TABLE=orders
```

Use `PAYMENT_MODE=mock` for local development and non-payment QA.

## Order Storage

The functions use this storage priority:

1. Supabase, when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.
2. Netlify Blobs, as a lightweight hosted fallback when available in the deployed site context.
3. In-memory storage, only for local smoke tests.

For formal operations, Supabase is required before live payment traffic because it is easier to query, back up, audit, and connect to an internal dashboard. Do not rely on in-memory storage for production orders.

## Supabase Schema

Create the orders table before live traffic:

```sql
create table if not exists public.orders (
  id text primary key,
  merchant_order_id text unique not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists orders_updated_at_idx
  on public.orders (updated_at desc);
```

The `payload` JSON stores the full order evidence package: merchant order ID, payment request ID, payment session ID, provider transaction ID, payment state, fulfillment state, customer email, IP/country evidence, user agent, item snapshot, policy version, payment events, fulfillment records, and support notes.

## Before Switching To Live

- Confirm the official account's API base URL and create-payment-session path.
- Paste the private key and public key as Netlify secrets, preserving line breaks or using base64 body text.
- Run one low-value live payment with a digital-only cart.
- Verify the order moves from `pending_payment` to `paid` through webhook.
- Verify the operations dashboard can see the payment evidence fields.
- Keep hosted checkout as the primary flow; do not collect card credentials in the browser.
