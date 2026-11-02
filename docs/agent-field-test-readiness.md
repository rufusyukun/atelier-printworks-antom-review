# Agent field test hardening — 2026-11-02

## Changed

- `/t` and `/bf-finance` keep their URLs and the original finance credential, as explicitly requested by the owner. A real credential was mistakenly included in an initial test commit in the public repository; tests now use a fake environment override. The old value remains potentially exposed in history. A rotation was briefly submitted and then reverted at the owner's instruction. Do not claim the retained credential is confidential.
- New combined `agent-checkout` endpoint removes one browser/server round trip. The frontend retains a 256-bit attempt token across uncertain network retries; the server derives a stable merchant order ID and rejects a different amount for the same attempt.
- Server owns catalog prices, agent amounts, currency, initial statuses, IDs, timestamps and payment evidence. Payment/receipt APIs require the per-order token. The wallet return carries it in the URL fragment, imports it into browser storage and removes it from the address bar.
- Generic list/internal finance endpoints require a separate operator credential. `ADMIN_ACCESS_KEY` can override the bundled digest; no plaintext operator credential is committed. Legacy orders without tokens must be handled through authenticated finance/admin views.
- Agent source filtering cannot be spoofed by notes on new storefront orders. The old notes fallback applies only to legacy records lacking a source.
- Storage reads use strong consistency. Payment-enabled environments fail closed when durable storage is unavailable. Ledger reads no longer truncate the global list to 100 before filtering. Bounded parallel reads replace serial network requests, and obsolete shared-index writes are removed.
- Callback signatures, request ID, amount, currency and provider reference are checked. Sequential duplicate success notifications are idempotent and late pending/failure cannot downgrade a paid record. `unpaid` no longer matches `paid`.
- Receipt uses the BF shell, truthful paid/pending/failure states, and a return-to-amount-selection link. Pending attempts remain resumable rather than creating a second payment.

## Antom request discipline

Tests use local memory/mock storage and fake network transports only. No live payment, inquiry, forged notification or load testing is part of verification.

Opening finance/admin pages does not issue inquiries. The receipt polls only local order records, at most six times after its initial read. Manual agent-finance refresh reconciles at most two pending orders sequentially, with a ten-minute per-order interval. User payment attempts and same-order retries may call the provider's pay API using the stable request ID; they are not stress tests.

## Repeat-payment policy — local update 2026-11-03

At the owner's instruction, the former 60-second restriction and its wait message have been removed from the local code. A fresh attempt may proceed immediately after another successful payment with the same email, IP and browser user agent. The checkout path no longer enumerates historical orders for that rule. Paid/refunded/disputed orders still reject another payment session; amount validation, attempt-token retry protection and callback checks remain.

This change is local and has not been deployed. Historical blocked records are not rewritten.

## Verification / release limits

- Run `node scripts/lint.mjs`, `node scripts/test.mjs`, `node --test scripts/payment-security.test.mjs`, `node scripts/build.mjs`.
- Production smoke checks must be read-only: page HTTP status, JS version, anonymous denial and authenticated finance **without** `reconcile=1`.
- Old open pages must reload before initiating a new payment, because the server now requires order access tokens.
- Browser automation is disabled in current Work settings; rendered HTML logic is unit-tested but device screenshots/click flows and real mainland mobile latency remain unverified.
- One controlled normal transaction by the owner is needed to confirm the real app return, webhook and finance receipt end-to-end.

## Outstanding blockers for a claim of full payment safety

Netlify Blobs is not a transactional ledger. Cross-instance concurrent create/update/callback writes are not atomic. The historical 60-second heuristic has been removed locally by owner instruction. Stable provider request IDs reduce duplicate charge risk but do not eliminate every race. Existing historical data was not rewritten or certified. A transactional database with unique request/event constraints, atomic state transitions, durable payment events, indexed identity/time queries and reconciliation audit records is required before scaling. No migration is performed by this patch.

Complete ledger listing still scales with the number of stored orders. Parallel reads improve the current implementation, but indexed database queries are the long-term performance fix. The current host cannot establish mainland reachability/latency; a custom domain alone does not prove faster access. Do not call this patch a complete security certification or a verified mainland speed fix.
