export function generateWaitlistConfirmationHtml(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://infuseandmuse.com';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Infuse &amp; Muse waitlist</title>
</head>
<body style="margin:0; padding:0; background-color:#f4efe6; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4efe6; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#0f3d2e; border-radius:24px 24px 0 0; padding: 48px 44px 40px; text-align:center;">
              <div style="display:inline-block; width:56px; height:56px; background-color:rgba(239,203,128,0.18); border-radius:50%; line-height:56px; text-align:center; margin-bottom:20px;">
                <span style="color:#efcb80; font-size:22px; line-height:56px;">&#9825;</span>
              </div>
              <p style="margin:0 0 6px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:rgba(239,203,128,0.65); font-family:Arial,sans-serif;">
                Infuse &amp; Muse
              </p>
              <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:34px; font-weight:normal; color:#ffffff; line-height:1.25;">
                You&rsquo;re on the list.
              </h1>
              <p style="margin:10px 0 0; font-size:13px; color:rgba(255,255,255,0.5); letter-spacing:0.12em; font-family:Arial,sans-serif;">
                Redefining Stillness
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#ffffff; padding: 36px 44px 0;">
              <p style="margin:0 0 10px; font-family:Georgia,serif; font-size:19px; color:#0f3d2e;">
                Welcome to the waitlist.
              </p>
              <p style="margin:0; font-size:15px; line-height:1.85; color:#5a6e68; font-family:Arial,sans-serif;">
                Thank you for your interest in Infuse &amp; Muse. We&rsquo;re putting the finishing touches on the shop and we&rsquo;ll reach out the moment it&rsquo;s ready — before anyone else gets access.
              </p>
            </td>
          </tr>

          <!-- WHAT TO EXPECT -->
          <tr>
            <td style="background-color:#ffffff; padding: 28px 44px 0;">
              <p style="margin:0 0 16px; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#efcb80; font-family:Arial,sans-serif;">
                What to Expect
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #ede7dd; font-size:14px; color:#0f3d2e; font-family:Georgia,serif;">
                    Early access
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #ede7dd; font-size:14px; color:#5a6e68; text-align:right; font-family:Arial,sans-serif;">
                    Shop before public launch
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #ede7dd; font-size:14px; color:#0f3d2e; font-family:Georgia,serif;">
                    Welcome offer
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #ede7dd; font-size:14px; color:#5a6e68; text-align:right; font-family:Arial,sans-serif;">
                    Exclusive discount at launch
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size:14px; color:#0f3d2e; font-family:Georgia,serif;">
                    Seasonal drops
                  </td>
                  <td style="padding: 12px 0; font-size:14px; color:#5a6e68; text-align:right; font-family:Arial,sans-serif;">
                    First to know, every time
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background-color:#ffffff; padding: 28px 44px 0;">
              <div style="border-top:1px solid #ede7dd;"></div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#ffffff; padding: 24px 44px 0; text-align:center;">
              <p style="margin:0 0 20px; font-size:14px; line-height:1.85; color:#5a6e68; font-family:Arial,sans-serif;">
                While you wait, take a look at what&rsquo;s coming.
              </p>
              <a href="${siteUrl}/waitlist"
                 style="display:inline-block; background-color:#0f3d2e; color:#ffffff; font-family:Georgia,serif; font-size:14px; text-decoration:none; padding:14px 36px; border-radius:100px; letter-spacing:0.06em;">
                Preview the experience
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 24px 24px; padding: 28px 44px 36px; text-align:center; border-top:1px solid #ede7dd; margin-top:28px;">
              <p style="margin:0 0 4px; font-size:12px; color:#a89e90; font-family:Arial,sans-serif;">
                Infuse &amp; Muse &middot; Mississauga, Ontario, Canada
              </p>
              <p style="margin:0; font-size:11px; color:#c0b8ae; font-family:Arial,sans-serif;">
                <a href="mailto:hello@infuseandmuse.com" style="color:#c0b8ae;">hello@infuseandmuse.com</a>
              </p>
            </td>
          </tr>

          <!-- OUTER FOOTER -->
          <tr>
            <td style="padding: 20px 0; text-align:center;">
              <p style="margin:0; font-size:11px; color:#b0a898; font-family:Arial,sans-serif;">
                You received this because you joined the waitlist at infuseandmuse.com
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
