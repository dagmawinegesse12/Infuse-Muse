export function generateWaitlistConfirmationHtml(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infuseandmuse.com';
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Infuse &amp; Muse</title>
</head>
<body style="margin:0; padding:0; background-color:#f4efe6; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4efe6; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">

          <!-- HEADER BAR -->
          <tr>
            <td style="background-color:#0f3d2e; border-radius:16px 16px 0 0; padding: 28px 48px 24px; text-align:center;">
              <p style="margin:0 0 3px; font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:normal; color:#efcb80; letter-spacing:0.08em;">
                Infuse &amp; Muse
              </p>
              <p style="margin:0; font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:rgba(239,203,128,0.45); font-family:Arial,sans-serif;">
                Luxury Tea &nbsp;&middot;&nbsp; Toronto
              </p>
            </td>
          </tr>

          <!-- LETTER BODY -->
          <tr>
            <td style="background-color:#ffffff; padding: 44px 48px 16px;">
              <p style="margin:0 0 24px; font-family:Georgia,'Times New Roman',serif; font-size:20px; font-weight:normal; color:#0f3d2e; line-height:1.4;">
                Welcome to Infuse &amp; Muse.
              </p>
              <p style="margin:0 0 14px; font-size:14px; color:#4a6259; font-family:Georgia,'Times New Roman',serif; line-height:1.65;">
                You are part of something quietly special.
              </p>
              <p style="margin:0 0 14px; font-size:14px; color:#4a6259; font-family:Georgia,'Times New Roman',serif; line-height:1.65;">
                A collection rooted in botanicals, ritual, and stillness.
              </p>
              <p style="margin:0 0 14px; font-size:14px; color:#4a6259; font-family:Georgia,'Times New Roman',serif; line-height:1.65;">
                Each blend is more than a drink.<br />
                It is a moment.
              </p>
              <p style="margin:0; font-size:14px; color:#4a6259; font-family:Georgia,'Times New Roman',serif; line-height:1.65;">
                You will be among the first to enter.<br />
                <br />
                Until then,<br />
                stay close.
              </p>
              <p style="margin:28px 0 0; font-family:Georgia,'Times New Roman',serif; font-size:14px; color:#0f3d2e;">
                &mdash; Mar
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 16px 16px; padding: 24px 48px 32px;">
              <div style="border-top:1px solid #ede7dd; padding-top:20px;">
                <p style="margin:0 0 6px; font-family:Georgia,'Times New Roman',serif; font-size:12px; color:#0f3d2e; letter-spacing:0.04em;">
                  Infuse &amp; Muse
                </p>
                <p style="margin:0; font-size:11px; color:#c0b4a8; font-family:Arial,sans-serif;">
                  <a href="https://www.instagram.com/infuseandmuse" style="color:#c0b4a8; text-decoration:none;">Instagram</a>
                  &nbsp;&middot;&nbsp;
                  <a href="https://www.pinterest.com/infuseandmuse" style="color:#c0b4a8; text-decoration:none;">Pinterest</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- OUTER FOOTER -->
          <tr>
            <td style="padding: 16px 0; text-align:center;">
              <p style="margin:0; font-size:10px; color:#c8bfb5; font-family:Arial,sans-serif;">
                You received this because you joined the waitlist at infuseandmuse.com
                &nbsp;&middot;&nbsp;
                <a href="${unsubscribeUrl}" style="color:#c8bfb5; text-decoration:underline;">Unsubscribe</a>
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
