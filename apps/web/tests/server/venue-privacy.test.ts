import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { VENUE, venueAddress, venueMapLinks } from '@/lib/event-venue';

const root = join(__dirname, '..', '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');

describe('venue address', () => {
  it('builds the address and both map links', () => {
    expect(venueAddress()).toBe('87 Wade Ave, Toronto, ON M6H 1P5');
    const { google, apple } = venueMapLinks();
    expect(google).toContain('87+Wade+Ave,+Toronto,+ON+M6H+1P5');
    expect(apple).toBe('https://maps.apple.com/?q=87+Wade+Ave,+Toronto,+ON+M6H+1P5');
    expect(VENUE.street).toBe('87 Wade Ave');
  });
});

/**
 * The street address is for ticket holders only. These are the files a visitor
 * or a search engine can reach without a ticket, plus the code that ships to
 * every browser. None of them may carry it, nor import the file that does.
 */
describe('the address stays out of public code', () => {
  const PUBLIC = [
    'lib/event.ts',
    'app/(site)/events/page.tsx',
    'components/event/ticket-purchase.tsx',
    'components/event/ticket-request-form.tsx',
    'components/event/ticket-lookup.tsx',
    'components/event/checkin-app.tsx',
    'components/layout/header.tsx',
    'components/layout/footer.tsx',
    'app/sitemap.ts',
  ];

  it.each(PUBLIC)('%s has no street address and does not import the venue file', (file) => {
    const source = read(file);
    expect(source).not.toMatch(/Wade|M6H/);
    expect(source).not.toMatch(/event-venue/);
  });

  it('only server code imports the venue file', () => {
    const importers = ['lib/ticket-email.ts', 'components/event/ticket-card.tsx'];
    for (const file of importers) expect(read(file)).toMatch(/event-venue/);
    expect(read('components/event/ticket-card.tsx')).not.toMatch(/'use client'/);
  });
});
