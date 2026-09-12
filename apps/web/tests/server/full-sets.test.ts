import { describe, expect, it } from 'vitest';
import { demoProducts } from '@/lib/demo-data';
import {
  FULL_SET_SUFFIX,
  fullSetSlides,
  fullSetTitleFor,
  isFullSet,
} from '@/lib/full-sets';

/**
 * The blend and its boxed set are paired by title, because the five Shopify
 * products were created by duplication and their handles are not uniformly
 * derived. That makes the title the contract, so it is worth pinning: a rename
 * in Shopify should lose the pairing quietly (the page sells the tin alone),
 * never mis-pair one blend's box with another blend's page.
 */
describe('pairing a blend with its boxed set', () => {
  it('builds the set title from the blend title', () => {
    expect(fullSetTitleFor('Rose VitaliTea')).toBe('Rose VitaliTea Full Set');
    expect(fullSetTitleFor('Classic Thyme')).toBe('Classic Thyme Full Set');
  });

  it('recognises a set and leaves the blends alone', () => {
    expect(isFullSet({ title: 'Coco Breeze Full Set' })).toBe(true);
    for (const blend of demoProducts) {
      expect(isFullSet(blend)).toBe(false);
    }
  });

  it('matches on the end of the title, not anywhere in it', () => {
    // A blend that merely mentions the words is still a blend.
    expect(isFullSet({ title: 'Full Set Sampler Tin' })).toBe(false);
    expect(FULL_SET_SUFFIX.startsWith(' ')).toBe(true);
  });

  it('round-trips every blend we sell', () => {
    for (const blend of demoProducts) {
      expect(isFullSet({ title: fullSetTitleFor(blend.title) })).toBe(true);
    }
  });
});

describe('boxed set photographs', () => {
  it('gives every blend a box shot followed by the three pieces', () => {
    for (const blend of demoProducts) {
      const slides = fullSetSlides(blend.slug);
      expect(slides).toHaveLength(4);
      expect(slides[0].src).toBe(`/images/accessories/full-set-${blend.slug}.jpg`);
      // Arrows and dots only appear above one slide; four is what makes the
      // set's gallery a gallery.
      expect(new Set(slides.map((s) => s.src)).size).toBe(4);
    }
  });

  it('describes every photograph for a screen reader', () => {
    for (const blend of demoProducts) {
      for (const slide of fullSetSlides(blend.slug)) {
        expect(slide.alt.length).toBeGreaterThan(20);
      }
    }
  });

  it('has nothing to show for a blend it does not know', () => {
    expect(fullSetSlides('a-blend-that-does-not-exist')).toEqual([]);
  });
});
