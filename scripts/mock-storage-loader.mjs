// Explicit offline test double, never imported by production functions.
// Force the existing mock-mode memory fallback; fail closed in payment-enabled mode.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@netlify/blobs') return {
      url: 'data:text/javascript,' + encodeURIComponent(
        'export function getStore(){throw new Error("Offline test: Blobs unavailable");}' +
        'export function connectLambda(){throw new Error("Offline test: no Netlify context");}'
      ), shortCircuit: true
    };
    return nextResolve(specifier, context);
  }
});
