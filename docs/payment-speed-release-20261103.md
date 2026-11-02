# Checkout speed release — 2026-11-03

Owner requested removal of the 60-second successful-payment cooldown and its message, plus checkout timing and device-specific wallet routing improvements. Release is prepared on `release/payment-speed-20261103` for the existing site only.

## Changes

- Remove the historical-success cooldown and its full-order-list read from checkout. New payment attempts can proceed immediately; paid orders remain closed to another payment session.
- Select iOS applink / Android scheme / desktop normal URL when available. Offer an HTTPS continuation for the same session, without creating another order or automatic fallback navigation.
- Report order/payment/lookup/provider/persist timing. Browser request diagnostics omit tokens, URLs and customer identity.
- Preserve order access tokens, amount validation, stable retry IDs, callback validation, durable payment evidence and credentials.

## Validation

Lint, static checks and build passed. 21 isolated payment tests passed using the explicitly named `scripts/mock-storage-loader.mjs` to force the local memory fallback. Ordinary npm test remains blocked on this workstation by missing official Blobs dependencies; real SDK integration and mainland-device latency are not certified. No live payment, inquiry or load tests were performed by the agent.

## Publication and recovery

- Existing site ID: `310b71db-6a0a-47db-b1a0-411d1695cb8c`.
- Baseline commit: `2463a4260bbd1f4f96aa01678af79ec10aa978db`.
- Baseline published deploy: `6ae8b303d1c452a2170a185b`.
- Assemble all changes on the release branch and merge once, letting the existing production build publish frontend and functions together. Do not upload only dist through static Drop.
- On a published regression, revert the release merge and rebuild the baseline behavior, or restore the recorded published deployment under the owner's recovery authorization. Code rollback does not reverse charges or alter stored orders.
- After publication, reload existing payment tabs. Verify page availability and anonymous access denial only; the owner performs any real payment test.
- No server upgrade or payment configuration change is included. Additional spending is authorized if later measurement demonstrates a need.
