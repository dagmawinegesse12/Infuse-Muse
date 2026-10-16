import { TICKET_PRODUCT_TYPE } from './event';

/**
 * What a Shopify order means as tickets. A ticket is a position (1, 2, 3...)
 * among the Opening Pour Ticket quantity on the order; being let in is an order
 * tag, `checked-in-<position>`, so the state lives in Shopify next to the
 * order and survives a redeploy.
 */
export type AdminOrderNode = {
  id: string;
  name: string;
  email: string | null;
  cancelledAt: string | null;
  displayFinancialStatus: string;
  tags: string[];
  billingAddress: { name: string | null } | null;
  lineItems: { nodes: { currentQuantity: number; product: { productType: string } | null }[] };
};

export type TicketStatus = 'ok' | 'cancelled' | 'refunded' | 'unpaid' | 'none';

export type TicketOrder = {
  /** The numeric id from gid://shopify/Order/<id>. */
  orderId: string;
  /** "#1042". */
  name: string;
  holder: string;
  email: string | null;
  /** Tickets still standing on the order after refunds and edits. */
  total: number;
  /** Positions already let in. */
  admitted: number[];
  /** The personal ticket link has already been emailed (the `tickets-emailed` tag). */
  emailed: boolean;
  status: TicketStatus;
};

const PAID = new Set(['PAID', 'PARTIALLY_REFUNDED']);
const ADMIT_TAG = /^checked-in-(\d{1,3})$/;
export const EMAILED_TAG = 'tickets-emailed';

export const admitTag = (position: number) => `checked-in-${position}`;
export const orderGid = (orderId: string) => `gid://shopify/Order/${orderId}`;

export function toTicketOrder(node: AdminOrderNode): TicketOrder {
  const ticketLines = node.lineItems.nodes.filter((l) => l.product?.productType === TICKET_PRODUCT_TYPE);
  const total = ticketLines.reduce((sum, l) => sum + l.currentQuantity, 0);

  let status: TicketStatus = 'ok';
  if (ticketLines.length === 0) status = 'none';
  else if (node.cancelledAt) status = 'cancelled';
  else if (node.displayFinancialStatus === 'REFUNDED' || total === 0) status = 'refunded';
  else if (!PAID.has(node.displayFinancialStatus)) status = 'unpaid';

  const holder = node.billingAddress?.name?.trim() || node.email?.split('@')[0] || 'Guest';

  const admitted = node.tags
    .map((t) => ADMIT_TAG.exec(t)?.[1])
    .filter((n): n is string => Boolean(n))
    .map(Number)
    .sort((a, b) => a - b);

  return {
    orderId: node.id.replace(/^gid:\/\/shopify\/Order\//, ''),
    name: node.name,
    holder,
    email: node.email,
    total,
    admitted,
    emailed: node.tags.includes(EMAILED_TAG),
    status,
  };
}

/** "Jane Doe" becomes "Jane D.", for pages a guest might screenshot and share. */
export function publicName(holder: string): string {
  const parts = holder.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? 'Guest';
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

/** Why a ticket cannot be used, in words the door can read out. */
export const STATUS_MESSAGE: Record<Exclude<TicketStatus, 'ok'>, string> = {
  cancelled: 'This order was cancelled.',
  refunded: 'This order was refunded.',
  unpaid: 'This order has not been paid.',
  none: 'This order has no Opening Pour tickets.',
};
