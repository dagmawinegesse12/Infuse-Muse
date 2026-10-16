import { TICKET_HANDLE } from '../event';
import type { CartItem } from './cart-types';

type Line = Pick<CartItem, 'slug' | 'quantity'>;

export const isTicketLine = (item: Pick<CartItem, 'slug'>) => item.slug === TICKET_HANDLE;

const allTickets = (items: Line[]) => items.length > 0 && items.every(isTicketLine);
const noTickets = (items: Line[]) => !items.some(isTicketLine);

/** The small count under "Your bag". Tea keeps counting lines as blends. */
export function bagCountLabel(items: Line[]): string {
  if (items.length === 0) return 'Empty';
  if (allTickets(items)) {
    const tickets = items.reduce((sum, item) => sum + item.quantity, 0);
    return `${tickets} ${tickets === 1 ? 'ticket' : 'tickets'}`;
  }
  const lines = items.length;
  if (noTickets(items)) return `${lines} ${lines === 1 ? 'blend' : 'blends'}`;
  return `${lines} ${lines === 1 ? 'item' : 'items'}`;
}

/** What one unit of a line is called on the bag page. */
export const unitNoun = (item: Pick<CartItem, 'slug'>) => (isTicketLine(item) ? 'ticket' : 'tin');

export function bagHeading(items: Line[]): string {
  if (allTickets(items)) return 'Review your tickets before checkout.';
  if (noTickets(items)) return 'Review your blends before checkout.';
  return 'Review your bag before checkout.';
}
