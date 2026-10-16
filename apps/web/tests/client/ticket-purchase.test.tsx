import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketPurchase } from '@/components/event/ticket-purchase';

const addItem = vi.fn();
type Item = { variantId: string; quantity: number };
const idle = () => ({
  pending: false,
  error: null as string | null,
  items: [] as Item[],
  checkoutUrl: null as string | null,
});
let cartState = idle();
const assign = vi.fn();

function visit(search: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, search, assign },
  });
}

vi.mock('@/lib/cart/cart-context', () => ({
  useCart: () => ({ addItem, state: cartState }),
}));

const VARIANT = 'gid://shopify/ProductVariant/99';

const onSale = () =>
  render(
    <TicketPurchase
      state="on-sale"
      variantId={VARIANT}
      priceCents={2500}
      currency="CAD"
      priceNote="plus HST"
    />
  );

beforeEach(() => visit(''));

afterEach(() => {
  cleanup();
  addItem.mockReset();
  assign.mockReset();
  cartState = idle();
});

describe('TicketPurchase', () => {
  it('shows the price and adds one ticket by default', async () => {
    onSale();
    expect(screen.getByText(/\$25\.00/)).toBeInTheDocument();
    expect(screen.getByText(/plus HST/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));
    expect(addItem).toHaveBeenCalledWith({ variantId: VARIANT, quantity: 1, openCart: true, invite: undefined });
  });

  it('sends the invite code with the add', async () => {
    render(
      <TicketPurchase
        state="on-sale"
        variantId={VARIANT}
        priceCents={2500}
        priceNote="plus HST"
        invite="let-me-in-123"
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));
    expect(addItem).toHaveBeenCalledWith({
      variantId: VARIANT,
      quantity: 1,
      openCart: true,
      invite: 'let-me-in-123',
    });
  });

  it('adds the chosen number of tickets', async () => {
    onSale();
    const more = screen.getByRole('button', { name: 'One more ticket' });
    await userEvent.click(more);
    await userEvent.click(more);
    await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));
    expect(addItem).toHaveBeenCalledWith({ variantId: VARIANT, quantity: 3, openCart: true, invite: undefined });
  });

  it('stops at six and cannot go below one', async () => {
    onSale();
    const more = screen.getByRole('button', { name: 'One more ticket' });
    const fewer = screen.getByRole('button', { name: 'One fewer ticket' });
    expect(fewer).toBeDisabled();

    for (let i = 0; i < 10; i++) await userEvent.click(more);
    expect(more).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));
    expect(addItem).toHaveBeenCalledWith({ variantId: VARIANT, quantity: 6, openCart: true, invite: undefined });
  });

  it('shows a cart error such as the per-order cap', () => {
    cartState = { ...idle(), error: 'You can buy up to 6 tickets per order.' };
    onSale();
    expect(screen.getByRole('alert')).toHaveTextContent('up to 6 tickets');
  });

  it.each([
    ['not-on-sale', 'Tickets are not on sale yet.'],
    ['sold-out', 'Sold out.'],
    ['closed', 'Ticket sales have closed.'],
    ['past', 'This gathering has passed.'],
  ] as const)('shows no purchase control when %s', (state, message) => {
    render(<TicketPurchase state={state} variantId={VARIANT} priceCents={2500} priceNote="plus HST" />);
    expect(screen.getByRole('status')).toHaveTextContent(message);
    expect(screen.queryByRole('button', { name: 'Get tickets' })).toBeNull();
  });

  it('shows no control if the ticket has no variant even when "on sale"', () => {
    render(<TicketPurchase state="on-sale" priceNote="plus HST" />);
    expect(screen.queryByRole('button', { name: 'Get tickets' })).toBeNull();
  });

  it('shows a Checkout button once tickets are in the bag', () => {
    cartState = {
      ...idle(),
      items: [{ variantId: VARIANT, quantity: 2 }],
      checkoutUrl: 'https://shop.example/checkout/abc',
    };
    onSale();
    expect(screen.getByText('2 tickets in your bag.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Checkout' })).toHaveAttribute(
      'href',
      'https://shop.example/checkout/abc'
    );
    expect(assign).not.toHaveBeenCalled();
  });

  it('shows no Checkout button for a bag with only other products', () => {
    cartState = {
      ...idle(),
      items: [{ variantId: 'gid://shopify/ProductVariant/1', quantity: 1 }],
      checkoutUrl: 'https://shop.example/checkout/abc',
    };
    onSale();
    expect(screen.queryByRole('link', { name: 'Checkout' })).toBeNull();
  });

  describe('arriving from the QR code', () => {
    it('adds without opening the bag, then goes straight to checkout', async () => {
      visit('?from=qr');
      cartState = {
        ...idle(),
        items: [{ variantId: VARIANT, quantity: 1 }],
        checkoutUrl: 'https://shop.example/checkout/abc',
      };
      onSale();
      await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));

      expect(addItem).toHaveBeenCalledWith({ variantId: VARIANT, quantity: 1, openCart: false, invite: undefined });
      expect(assign).toHaveBeenCalledWith('https://shop.example/checkout/abc');
    });

    it('stays on the page and shows the problem if the add failed', async () => {
      visit('?from=qr');
      cartState = { ...idle(), error: 'You can buy up to 6 tickets per order.' };
      onSale();
      await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));

      expect(assign).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('up to 6 tickets');
      expect(screen.getByRole('button', { name: 'Get tickets' })).toBeEnabled();
    });

    it('does nothing special for other query strings', async () => {
      visit('?from=instagram');
      onSale();
      await userEvent.click(screen.getByRole('button', { name: 'Get tickets' }));
      expect(addItem).toHaveBeenCalledWith({ variantId: VARIANT, quantity: 1, openCart: true, invite: undefined });
      expect(assign).not.toHaveBeenCalled();
    });
  });
});
