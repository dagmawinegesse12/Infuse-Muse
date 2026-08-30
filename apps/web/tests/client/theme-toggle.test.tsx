import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/system/theme';
import { ThemeToggle } from '@/components/system/theme-toggle';
import { THEME_STORAGE_KEY } from '@/components/system/theme-constants';

const mount = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.muse = 'night';
  });
  afterEach(() => delete document.documentElement.dataset.muse);

  it('offers both themes as radios', () => {
    mount();
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Light' })).toBeInTheDocument();
  });

  it('is labelled for assistive technology', () => {
    mount();
    expect(screen.getByRole('radiogroup', { name: /colour theme/i })).toBeInTheDocument();
  });

  it('reflects the theme already applied to the document', () => {
    document.documentElement.dataset.muse = 'light';
    mount();
    expect(screen.getByRole('radio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'false');
  });

  it('writes the choice to the document root', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement.dataset.muse).toBe('light');
  });

  it('persists the choice so it survives a reload', async () => {
    mount();
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('switches back to dark', async () => {
    document.documentElement.dataset.muse = 'light';
    mount();
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement.dataset.muse).toBe('night');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('night');
  });

  it('still switches when localStorage throws (private browsing)', async () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => { throw new Error('blocked'); });
    mount();
    await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement.dataset.muse).toBe('light');
    setItem.mockRestore();
  });
});
