export function AnnouncementBar({ message }: { message: string }) {
  return <div className="border-b border-gold-400/20 bg-forest-900"><div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm text-gold-300 sm:px-6 lg:px-8">{message}</div></div>;
}
