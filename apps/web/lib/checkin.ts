import { timingSafeEqual } from 'crypto';
import { fetchTicketOrder, setAdmitted } from './shopify-admin';
import { STATUS_MESSAGE, type TicketOrder } from './tickets';
import { verifyTicket } from './ticket-token';

/** The door's PIN, sent with every check-in request. Unset means nobody gets in. */
export function isStaff(pin: string | null): boolean {
  const expected = process.env.CHECKIN_PIN;
  if (!expected || !pin) return false;
  const a = Buffer.from(pin);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type ScanOutcome =
  | 'admitted'
  | 'already'
  | 'invalid'
  | 'cancelled'
  | 'refunded'
  | 'unpaid'
  | 'none';

export type ScanResult = {
  result: ScanOutcome;
  message: string;
  holder?: string;
  orderName?: string;
  orderId?: string;
  position?: number;
  total?: number;
  admittedCount?: number;
};

const INVALID: ScanResult = { result: 'invalid', message: 'This is not a valid Opening Pour ticket.' };

function describe(order: TicketOrder, position: number) {
  return {
    holder: order.holder,
    orderName: order.name,
    orderId: order.orderId,
    position,
    total: order.total,
  };
}

/** Reads a ticket's QR and, if it is good and unused, lets it in. */
export async function scanTicket(token: string): Promise<ScanResult> {
  const ticket = verifyTicket(token);
  if (!ticket) return INVALID;

  const order = await fetchTicketOrder(ticket.orderId);
  if (!order) return INVALID;

  const base = describe(order, ticket.position);
  if (order.status !== 'ok') {
    return { result: order.status, message: STATUS_MESSAGE[order.status], ...base };
  }
  if (ticket.position > order.total) {
    return { ...INVALID, message: 'This ticket is no longer on the order.', ...base };
  }
  if (order.admitted.includes(ticket.position)) {
    return {
      result: 'already',
      message: 'This ticket has already been used.',
      ...base,
      admittedCount: order.admitted.length,
    };
  }

  await setAdmitted(order.orderId, ticket.position, true);
  return {
    result: 'admitted',
    message: 'Welcome.',
    ...base,
    admittedCount: order.admitted.length + 1,
  };
}

/** Manual admit or undo from the guest list. */
export async function setTicketAdmitted(
  orderId: string,
  position: number,
  admitted: boolean
): Promise<{ ok: true; order: TicketOrder } | { ok: false; message: string }> {
  const order = await fetchTicketOrder(orderId);
  if (!order) return { ok: false, message: 'Order not found.' };
  if (order.status !== 'ok') return { ok: false, message: STATUS_MESSAGE[order.status] };
  if (position < 1 || position > order.total) {
    return { ok: false, message: 'That ticket is not on the order.' };
  }
  const already = order.admitted.includes(position);
  if (admitted !== already) await setAdmitted(orderId, position, admitted);
  const next = admitted
    ? [...new Set([...order.admitted, position])]
    : order.admitted.filter((p) => p !== position);
  return { ok: true, order: { ...order, admitted: next.sort((a, b) => a - b) } };
}
