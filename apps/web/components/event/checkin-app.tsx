'use client';

import jsQR from 'jsqr';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';

type Order = {
  orderId: string;
  name: string;
  holder: string;
  email: string;
  total: number;
  admitted: number[];
  status: 'ok' | 'cancelled' | 'refunded' | 'unpaid' | 'none';
};
type Guests = { orders: Order[]; sold: number; admitted: number };
type Scan = {
  result: 'admitted' | 'already' | 'invalid' | 'cancelled' | 'refunded' | 'unpaid' | 'none';
  message: string;
  holder?: string;
  orderName?: string;
  orderId?: string;
  position?: number;
  total?: number;
};

const PIN_KEY = 'opening-pour-checkin-pin';
const GOOD = '#1f7a4d';
const BAD = '#b3261e';
const WARN = '#b26a00';

async function call<T>(path: string, pin: string, body: unknown = {}): Promise<{ status: number; data: T }> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-checkin-pin': pin },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: (await res.json().catch(() => ({}))) as T };
}

export function CheckinApp() {
  const [pin, setPin] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guests | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'scan' | 'guests'>('scan');

  const load = useCallback(async (candidate: string) => {
    const { status, data } = await call<Guests & { error?: string }>('/api/checkin/list', candidate);
    if (status === 401) throw new Error('Wrong PIN.');
    if (status !== 200) throw new Error(data.error ?? 'Could not load the guest list.');
    setGuests(data);
    return data;
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.sessionStorage.getItem(PIN_KEY);
    } catch {}
    if (!saved) return;
    load(saved)
      .then(() => setPin(saved))
      .catch(() => {});
  }, [load]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const candidate = String(new FormData(event.currentTarget).get('pin') ?? '').trim();
    setError('');
    try {
      await load(candidate);
      setPin(candidate);
      try {
        window.sessionStorage.setItem(PIN_KEY, candidate);
      } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  if (!pin) {
    return (
      <form onSubmit={signIn} className="grid max-w-sm gap-6">
        <h1 className="t-sub">Door check-in</h1>
        <div>
          <label htmlFor="pin" className="t-label">
            Staff PIN
          </label>
          <input id="pin" name="pin" type="password" autoComplete="off" className="field mt-3" />
        </div>
        {error ? (
          <p role="alert" className="t-body" style={{ color: '#c2410c' }}>
            {error}
          </p>
        ) : null}
        <div>
          <Button type="submit">Open</Button>
        </div>
      </form>
    );
  }

  const refresh = () => load(pin).catch(() => {});

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--rule)' }}>
        <div>
          <p className="t-label">Admitted</p>
          <p
            className="mt-1"
            style={{
              fontFamily: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
              fontSize: '1.75rem',
              lineHeight: 1.2,
              color: 'var(--ink-strong)',
            }}
          >
            {guests?.admitted ?? 0} of {guests?.sold ?? 0}
          </p>
        </div>
        <div className="flex gap-6">
          {(['scan', 'guests'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="t-label hit"
              style={{ color: 'var(--ink-strong)', opacity: tab === t ? 1 : 0.45 }}
            >
              {t === 'scan' ? 'Scan' : 'Guest list'}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6">
        {tab === 'scan' ? (
          <Scanner pin={pin} onChanged={refresh} />
        ) : (
          <GuestList pin={pin} guests={guests} onChanged={refresh} />
        )}
      </div>
    </div>
  );
}

function Scanner({ pin, onChanged }: { pin: string; onChanged: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const busyRef = useRef(false);
  const lastRef = useRef({ text: '', at: 0 });
  const [running, setRunning] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  const [problem, setProblem] = useState('');

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setRunning(false);
  }, []);

  useEffect(() => stop, [stop]);

  const handle = useCallback(
    async (text: string) => {
      busyRef.current = true;
      try {
        const { status, data } = await call<Scan & { error?: string }>('/api/checkin/scan', pin, { text });
        if (status !== 200) throw new Error(data.error ?? 'Could not check that ticket.');
        setScan(data);
        setProblem('');
        navigator.vibrate?.(data.result === 'admitted' ? 60 : [80, 60, 80]);
        onChanged();
      } catch (e) {
        setProblem(e instanceof Error ? e.message : 'Something went wrong.');
      } finally {
        busyRef.current = false;
      }
    },
    [pin, onChanged]
  );

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2 && !busyRef.current) {
        const w = 640;
        const h = Math.round((video.videoHeight / video.videoWidth) * w) || 480;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const img = ctx.getImageData(0, 0, w, h);
          const hit = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
          const now = Date.now();
          // The same code stays in view for a moment; read it once.
          if (hit?.data && !(hit.data === lastRef.current.text && now - lastRef.current.at < 4000)) {
            lastRef.current = { text: hit.data, at: now };
            void handle(hit.data);
          }
        }
      }
      timer = setTimeout(() => (frame = requestAnimationFrame(tick)), 120);
    };
    tick();
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [running, handle]);

  async function start() {
    setProblem('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);
    } catch {
      setProblem('The camera could not start. Allow camera access for this site, or use the guest list.');
    }
  }

  async function undo() {
    if (!scan?.orderId || !scan.position) return;
    const { data } = await call<{ ok?: boolean }>('/api/checkin/admit', pin, {
      orderId: scan.orderId,
      position: scan.position,
      admitted: false,
    });
    if (data.ok) {
      setScan(null);
      lastRef.current = { text: '', at: 0 };
      onChanged();
    }
  }

  const colour = scan ? (scan.result === 'admitted' ? GOOD : scan.result === 'already' ? WARN : BAD) : 'transparent';
  const headline =
    scan?.result === 'admitted'
      ? 'Valid'
      : scan?.result === 'already'
        ? 'Already used'
        : scan
          ? 'Not valid'
          : '';

  return (
    <div className="grid gap-6">
      <div className="relative overflow-hidden border" style={{ borderColor: 'var(--rule-strong)', aspectRatio: '4 / 3' }}>
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        <canvas ref={canvasRef} hidden />
        {!running ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={start}>Start scanning</Button>
          </div>
        ) : null}
      </div>

      {problem ? (
        <p role="alert" className="t-body" style={{ color: '#c2410c' }}>
          {problem}
        </p>
      ) : null}

      {scan ? (
        <div role="status" className="p-6" style={{ background: colour, color: '#fff' }}>
          <p className="t-label" style={{ color: '#fff' }}>
            {headline}
          </p>
          {scan.holder ? (
            <p className="mt-2" style={{ fontSize: '1.75rem', lineHeight: 1.2 }}>
              {scan.holder}
            </p>
          ) : null}
          {scan.position && scan.total ? (
            <p className="mt-2" style={{ fontSize: '1rem' }}>
              Ticket {scan.position} of {scan.total} · Order {scan.orderName}
            </p>
          ) : null}
          <p className="mt-3" style={{ fontSize: '0.9375rem' }}>
            {scan.message}
          </p>
          {scan.result === 'admitted' ? (
            <button type="button" onClick={undo} className="t-label mt-5 underline" style={{ color: '#fff' }}>
              Undo
            </button>
          ) : null}
        </div>
      ) : running ? (
        <p className="t-body">Point the camera at a ticket.</p>
      ) : null}
    </div>
  );
}

function GuestList({ pin, guests, onChanged }: { pin: string; guests: Guests | null; onChanged: () => void }) {
  const [query, setQuery] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [note, setNote] = useState('');

  if (!guests) return <p className="t-body">Loading…</p>;

  const q = query.trim().toLowerCase().replace(/^#/, '');
  const rows = guests.orders.filter(
    (o) =>
      !q ||
      o.holder.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.name.replace('#', '').includes(q)
  );

  async function toggle(order: Order, position: number) {
    const admit = !order.admitted.includes(position);
    const key = `${order.orderId}-${position}`;
    setBusyKey(key);
    setNote('');
    const { data } = await call<{ ok?: boolean; message?: string }>('/api/checkin/admit', pin, {
      orderId: order.orderId,
      position,
      admitted: admit,
    });
    if (!data.ok) setNote(data.message ?? 'Could not update that ticket.');
    setBusyKey('');
    onChanged();
  }

  return (
    <div>
      <label htmlFor="guest-search" className="t-label">
        Search by name, email or order number
      </label>
      <input
        id="guest-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="field mt-3"
        autoComplete="off"
      />
      {note ? (
        <p role="alert" className="t-body mt-4" style={{ color: '#c2410c' }}>
          {note}
        </p>
      ) : null}

      <ul className="mt-6">
        {rows.length === 0 ? <li className="t-body py-6">No matching orders.</li> : null}
        {rows.map((order) => (
          <li key={order.orderId} className="border-b py-5" style={{ borderColor: 'var(--rule)' }}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="t-body t-body--lead" style={{ color: 'var(--ink-strong)' }}>
                {order.holder}
              </p>
              <p className="t-label">{order.name}</p>
            </div>
            {order.status !== 'ok' ? (
              <p className="t-body mt-2" style={{ color: BAD }}>
                {order.status === 'cancelled'
                  ? 'Cancelled'
                  : order.status === 'refunded'
                    ? 'Refunded'
                    : 'Not paid'}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-3">
                {Array.from({ length: order.total }, (_, i) => i + 1).map((position) => {
                  const done = order.admitted.includes(position);
                  const key = `${order.orderId}-${position}`;
                  return (
                    <button
                      key={position}
                      type="button"
                      disabled={busyKey === key}
                      onClick={() => toggle(order, position)}
                      className="t-label border px-4 py-3"
                      style={{
                        borderColor: done ? GOOD : 'var(--rule-strong)',
                        background: done ? GOOD : 'transparent',
                        color: done ? '#fff' : 'var(--ink-strong)',
                      }}
                      aria-pressed={done}
                      aria-label={`Ticket ${position} of ${order.total}, ${done ? 'admitted, tap to undo' : 'tap to admit'}`}
                    >
                      {done ? `Ticket ${position}: in` : `Ticket ${position}: admit`}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
