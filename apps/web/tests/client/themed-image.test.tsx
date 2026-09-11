import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemedImage } from '@/components/system/themed-image';

describe('ThemedImage', () => {
  it('renders one image per theme, tagged for the CSS to choose between', () => {
    const { container } = render(
      <ThemedImage src="/night.jpg" srcLight="/light.jpg" alt="Tin" width={300} height={400} />
    );
    const imgs = [...container.querySelectorAll('img')];
    // Outside a Next app the default loader rewrites src to /_next/image?url=…,
    // so compare the decoded address rather than the raw attribute.
    const srcs = imgs.map((i) => decodeURIComponent(i.getAttribute('src') ?? ''));

    expect(srcs).toHaveLength(2);
    expect(srcs[0]).toContain('/night.jpg');
    expect(srcs[1]).toContain('/light.jpg');
    expect(imgs[0].className).toContain('muse-img--night');
    expect(imgs[1].className).toContain('muse-img--light');
  });

  it('is a single plain image when there is no separate light version', () => {
    const { container } = render(<ThemedImage src="/one.jpg" alt="Tin" width={300} height={400} />);
    const imgs = container.querySelectorAll('img');

    expect(imgs).toHaveLength(1);
    expect(imgs[0].className).not.toMatch(/muse-img/);
    expect(screen.getByAltText('Tin')).toBeInTheDocument();
  });

  it('keeps extra classes on both versions', () => {
    const { container } = render(
      <ThemedImage src="/n.jpg" srcLight="/l.jpg" alt="" width={1} height={1} className="object-cover" />
    );
    for (const img of container.querySelectorAll('img')) {
      expect(img.className).toContain('object-cover');
    }
  });
});
