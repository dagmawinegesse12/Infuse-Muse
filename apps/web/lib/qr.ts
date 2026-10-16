import QRCode from 'qrcode';

/** A QR code as inline SVG, in the site's green on cream. Server-side only. */
export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#0f3d2e', light: '#f4efe6' },
  });
}
