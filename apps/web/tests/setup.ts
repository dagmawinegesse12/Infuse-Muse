import '@testing-library/jest-dom/vitest';

// jsdom implements neither of these, and the header/cart drawer both call them.
if (typeof window !== 'undefined') {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;

  {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds: readonly number[] = [];
      constructor(private cb: IntersectionObserverCallback) {}
      // Reveal wrappers should render their children in tests, not stay hidden.
      observe(target: Element) {
        this.cb(
          [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
          this
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  }
}
