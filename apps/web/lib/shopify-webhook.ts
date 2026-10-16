import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Shopify signs every webhook body with the app's client secret
 * (base64 HMAC-SHA256 in the X-Shopify-Hmac-Sha256 header). Anything that
 * does not verify is not from Shopify and is ignored.
 */
export function verifyShopifyWebhook(rawBody: string, header: string | null, secret: string | undefined): boolean {
  if (!secret || !header) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest();
  let given: Buffer;
  try {
    given = Buffer.from(header, 'base64');
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}
