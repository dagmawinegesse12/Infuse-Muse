import { EVENT, dateLabel, timeLabel } from './event';
import { venueAddress, venueMapLinks } from './event-venue';
import { escapeHtml } from './validation';

export type TicketEmailInput = {
  holder: string;
  orderName: string;
  tickets: number;
  link: string;
  findUrl: string;
};

const GREEN = '#0f3d2e';
const CREAM = '#f4efe6';

const firstName = (holder: string) => holder.trim().split(/\s+/)[0] || 'there';

/** The email a guest gets once their order with tickets is paid: one button to their personal ticket page. */
export function ticketEmail({ holder, orderName, tickets, link, findUrl }: TicketEmailInput) {
  const name = firstName(holder);
  const count = tickets === 1 ? 'Your ticket' : `Your ${tickets} tickets`;
  const when = `${dateLabel()}, ${timeLabel()}`;
  const address = venueAddress();
  const maps = venueMapLinks();
  const subject = `Your ${EVENT.name} ${tickets === 1 ? 'ticket' : 'tickets'}`;

  const text = [
    `Hello ${name},`,
    '',
    `${count} for ${EVENT.name} ${tickets === 1 ? 'is' : 'are'} ready.`,
    '',
    `View your ${tickets === 1 ? 'ticket' : 'tickets'}: ${link}`,
    '',
    when,
    address,
    `Google Maps: ${maps.google}`,
    `Apple Maps: ${maps.apple}`,
    '',
    'Show the QR code at the door. A screenshot works.',
    '',
    `You can find your tickets again at ${findUrl} with your order number (${orderName}) and this email address.`,
    '',
    'Infuse & Muse',
  ].join('\n');

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:${CREAM};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;font-family:Georgia,'Times New Roman',serif;color:${GREEN};">
<tr><td style="padding:0 0 24px 0;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Infuse &amp; Muse</td></tr>
<tr><td style="font-size:28px;line-height:1.25;padding:0 0 20px 0;">${escapeHtml(count)} for ${escapeHtml(EVENT.name)} ${tickets === 1 ? 'is' : 'are'} ready.</td></tr>
<tr><td style="font-size:16px;line-height:1.6;padding:0 0 28px 0;">Hello ${escapeHtml(name)}, your personal ticket page has a QR code for each ticket.</td></tr>
<tr><td style="padding:0 0 28px 0;"><a href="${escapeHtml(link)}" style="display:inline-block;background:${GREEN};color:${CREAM};text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;">View your ${tickets === 1 ? 'ticket' : 'tickets'}</a></td></tr>
<tr><td style="font-size:16px;line-height:1.6;padding:0 0 28px 0;">${escapeHtml(when)}<br>${escapeHtml(address)}<br><a href="${escapeHtml(maps.google)}" style="color:${GREEN};font-family:Arial,Helvetica,sans-serif;font-size:13px;">Google Maps</a> &nbsp;&middot;&nbsp; <a href="${escapeHtml(maps.apple)}" style="color:${GREEN};font-family:Arial,Helvetica,sans-serif;font-size:13px;">Apple Maps</a></td></tr>
<tr><td style="font-size:16px;line-height:1.6;padding:0 0 28px 0;">Show the QR code at the door. A screenshot works.</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#4a5f55;padding:0 0 8px 0;">If the button does not open, copy this link:<br><a href="${escapeHtml(link)}" style="color:#4a5f55;word-break:break-all;">${escapeHtml(link)}</a></td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#4a5f55;">You can find your tickets again at <a href="${escapeHtml(findUrl)}" style="color:#4a5f55;">${escapeHtml(findUrl.replace(/^https?:\/\//, ''))}</a> with your order number (${escapeHtml(orderName)}) and this email address.</td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}
