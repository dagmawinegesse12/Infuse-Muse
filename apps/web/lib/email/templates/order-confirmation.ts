import type { OrderItem } from '../service';

type Params = {
  customerName?: string;
  orderItems: OrderItem[];
  amountTotal: number; // in cents
  sessionId: string;
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

export function generateOrderConfirmationHtml({
  customerName,
  orderItems,
  amountTotal,
  sessionId,
}: Params): string {
  const greeting = customerName
    ? `Hi ${customerName.split(' ')[0]},`
    : 'Hello,';

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://infuseandmuse.ca';

  const orderRef = sessionId.slice(-12).toUpperCase();

  const itemRows =
    orderItems.length > 0
      ? orderItems
          .map(
            (item) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #ede7dd; font-size: 15px; color: #1a3d32; font-family: Georgia, serif;">
            ${item.name}
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid #ede7dd; font-size: 14px; color: #7a6a56; text-align: center; font-family: Arial, sans-serif;">
            &times; ${item.qty}
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid #ede7dd; font-size: 15px; color: #1a3d32; text-align: right; font-family: Arial, sans-serif; white-space: nowrap;">
            ${formatPrice(item.unit * item.qty)}
          </td>
        </tr>`
          )
          .join('')
      : `<tr><td colspan="3" style="padding: 14px 0; color: #9a8f83; font-size: 14px;">Item details not available.</td></tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Infuse &amp; Muse order is confirmed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4efe6; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4efe6; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:#173c33; border-radius:24px 24px 0 0; padding: 44px 44px 36px; text-align:center;">
              <!-- Checkmark circle -->
              <div style="display:inline-block; width:56px; height:56px; background-color:rgba(255,255,255,0.15); border-radius:50%; line-height:56px; text-align:center; margin-bottom:20px;">
                <span style="color:#ffffff; font-size:24px; line-height:56px;">&#10003;</span>
              </div>
              <p style="margin:0 0 6px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(209,231,220,0.65); font-family:Arial,sans-serif;">
                Infuse &amp; Muse
              </p>
              <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:34px; font-weight:normal; color:#ffffff; line-height:1.25;">
                Order confirmed.
              </h1>
              <p style="margin:10px 0 0; font-size:13px; color:rgba(255,255,255,0.55); letter-spacing:0.12em; font-family:Arial,sans-serif;">
                Redefining Stillness
              </p>
            </td>
          </tr>

          <!-- ── GREETING ── -->
          <tr>
            <td style="background-color:#ffffff; padding: 36px 44px 0;">
              <p style="margin:0 0 10px; font-family:Georgia,serif; font-size:19px; color:#1a3d32;">
                ${greeting}
              </p>
              <p style="margin:0; font-size:15px; line-height:1.8; color:#5a6e68; font-family:Arial,sans-serif;">
                Thank you for your order. Your tea blends are confirmed and we'll be in touch shortly with pickup or shipping details.
              </p>
            </td>
          </tr>

          <!-- ── ORDER SUMMARY ── -->
          <tr>
            <td style="background-color:#ffffff; padding: 32px 44px 0;">
              <p style="margin:0 0 16px; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#c79f3d; font-family:Arial,sans-serif;">
                Order Summary
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <thead>
                  <tr>
                    <th style="text-align:left; font-size:11px; color:#9a8f83; font-weight:normal; letter-spacing:0.14em; text-transform:uppercase; padding-bottom:10px; border-bottom:2px solid #ede7dd; font-family:Arial,sans-serif;">
                      Blend
                    </th>
                    <th style="text-align:center; font-size:11px; color:#9a8f83; font-weight:normal; letter-spacing:0.14em; text-transform:uppercase; padding-bottom:10px; border-bottom:2px solid #ede7dd; font-family:Arial,sans-serif;">
                      Qty
                    </th>
                    <th style="text-align:right; font-size:11px; color:#9a8f83; font-weight:normal; letter-spacing:0.14em; text-transform:uppercase; padding-bottom:10px; border-bottom:2px solid #ede7dd; font-family:Arial,sans-serif; white-space:nowrap;">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top:18px; font-size:12px; color:#9a8f83; text-transform:uppercase; letter-spacing:0.14em; font-family:Arial,sans-serif;">
                      Total paid
                    </td>
                    <td style="padding-top:18px; font-family:Georgia,serif; font-size:22px; color:#1a3d32; text-align:right; white-space:nowrap;">
                      ${formatPrice(amountTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background-color:#ffffff; padding: 28px 44px 0;">
              <div style="border-top:1px solid #ede7dd;"></div>
            </td>
          </tr>

          <!-- ── WHAT HAPPENS NEXT ── -->
          <tr>
            <td style="background-color:#ffffff; padding: 24px 44px 0;">
              <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#c79f3d; font-family:Arial,sans-serif;">
                What Happens Next
              </p>
              <p style="margin:0; font-size:14px; line-height:1.85; color:#5a6e68; font-family:Arial,sans-serif;">
                We'll reach out with pickup or fulfillment details. For questions about your order, gifting, or local pickup in Mississauga, email us at
                <a href="mailto:hello@infuseandmuse.ca" style="color:#173c33; text-decoration:underline;">hello@infuseandmuse.ca</a>
                or visit our <a href="${siteUrl}/faq" style="color:#173c33; text-decoration:underline;">FAQ page</a>.
              </p>
            </td>
          </tr>

          <!-- ── CTA BUTTON ── -->
          <tr>
            <td style="background-color:#ffffff; padding: 28px 44px 0; text-align:center;">
              <a href="${siteUrl}/products"
                 style="display:inline-block; background-color:#173c33; color:#ffffff; font-family:Georgia,serif; font-size:14px; text-decoration:none; padding:14px 36px; border-radius:100px; letter-spacing:0.06em;">
                Explore more blends
              </a>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 24px 24px; padding: 28px 44px 36px; text-align:center; border-top:1px solid #ede7dd; margin-top:28px;">
              <p style="margin:0 0 4px; font-size:12px; color:#a89e90; font-family:Arial,sans-serif;">
                Infuse &amp; Muse &middot; Mississauga, Ontario, Canada
              </p>
              <p style="margin:0; font-size:11px; color:#c0b8ae; font-family:Arial,sans-serif; letter-spacing:0.06em;">
                Order ref: ${orderRef}
              </p>
            </td>
          </tr>

          <!-- ── OUTER FOOTER ── -->
          <tr>
            <td style="padding: 20px 0; text-align:center;">
              <p style="margin:0; font-size:11px; color:#b0a898; font-family:Arial,sans-serif;">
                You received this because you placed an order at infuseandmuse.ca
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
