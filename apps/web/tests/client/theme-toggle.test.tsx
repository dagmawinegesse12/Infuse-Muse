import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { THEME_STORAGE_KEY } from '@/components/system/theme-constants';

/**
 * The light ground is withdrawn (LIGHT_THEME_ENABLED in theme-constants), so
 * what ships is "no toggle, and no way to reach light". The first block proves
 * that, including the two ways in that are not the toggle.
 *
 * The machinery was not deleted, so it is still covered: the second block
 * re-enables light through a module mock and asserts the whole original
 * behaviour still holds. That is what makes flipping the flag back a one-line
 * change rather than an archaeology exercise.
 */

type Constants = typeof import('@/components/system/theme-constants');
type Selectable = Constants['SELECTABLE_THEMES'];

/**
 * Loads the theme modules fresh, optionally with a different set of selectable
 * themes, and renders the toggle beside a probe that reports what the provider
 * thinks and can ask it for a theme directly.
 */
async function mount(selectable?: Selectable) {
  vi.resetModules();

  if (selectable) {
    vi.doMock('@/components/system/theme-constants', async () => {
      const actual = await vi.importActual<Constants>('@/components/system/theme-constants');
      return {
        ...actual,
        SELECTABLE_THEMES: selectable,
        THEME_CHOICE_ENABLED: selectable.length > 1,
      };
    });
  } else {
    vi.doUnmock('@/components/system/theme-constants');
  }

  const { ThemeProvider, useMuseTheme } = await import('@/components/system/theme');
  const { ThemeToggle } = await import('@/components/system/theme-toggle');

  function Probe() {
    const { theme, setTheme } = useMuseTheme();
    return (
      <button data-testid="probe" onClick={() => setTheme('light')}>
        {theme}
      </button>
    );
  }

  return render(
    <ThemeProvider>
      <ThemeToggle />
      <Probe />
    </ThemeProvider>
  );
}

const probe = () => screen.getByTestId('probe');

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.dataset.muse = 'night';
});

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.muse;
});

describe('ThemeToggle, with the light ground withdrawn', () => {
  it('renders no control at all', async () => {
    await mount();
    expect(screen.queryByRole('radiogroup', { name: /colour theme/i })).toBeNull();
    expect(screen.queryByRole('radio')).toBeNull();
  });

  it('refuses the withdrawn theme when asked for it directly', async () => {
    await mount();
    await userEvent.click(probe());

    expect(document.documentElement.dataset.muse).toBe('night');
    expect(probe()).toHaveTextContent('night');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('does not adopt a light preference left over from before', async () => {
    // What a viewer who chose light months ago still has on their machine.
    document.documentElement.dataset.muse = 'light';
    await mount();

    expect(probe()).toHaveTextContent('night');
  });
});

describe('ThemeToggle, with the light ground restored', () => {
  const both: Selectable = ['night', 'light'];

  it('offers both themes as radios', async () => {
    await mount(both);
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Light' })).toBeInTheDocument();
  });

  it('is labelled for assistive technology', async () => {
    await mount(both);
    expect(screen.getByRole('radiogroup', { name: /colour theme/i })).toBeInTheDocument();
  });

  it('reflects the theme already applied to the document', async () => {
    document.documentElement.dataset.muse = 'light';
    await mount(both);
    expect(screen.getByRole('radio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'false');
  });

  it('writes the choice to the document root', async () => {
    await mount(both);
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement.dataset.muse).toBe('light');
  });

  it('persists the choice so it survives a reload', async () => {
    await mount(both);
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('switches back to dark', async () => {
    document.documentElement.dataset.muse = 'light';
    await mount(both);
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement.dataset.muse).toBe('night');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('night');
  });

  it('still switches when localStorage throws (private browsing)', async () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => { throw new Error('blocked'); });
    await mount(both);
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement.dataset.muse).toBe('light');
    setItem.mockRestore();
  });
});
