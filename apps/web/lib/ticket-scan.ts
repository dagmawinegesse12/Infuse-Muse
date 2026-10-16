/** Pulls a ticket token out of whatever a scanner read: a full ticket URL or the bare token. */
export function ticketTokenFromScan(text: string): string | null {
  const trimmed = text.trim();
  const fromUrl = /\/t\/([0-9]{6,20}-[0-9]{1,3}-[0-9a-f]{20})(?:[/?#]|$)/.exec(trimmed);
  if (fromUrl) return fromUrl[1];
  return /^[0-9]{6,20}-[0-9]{1,3}-[0-9a-f]{20}$/.test(trimmed) ? trimmed : null;
}
