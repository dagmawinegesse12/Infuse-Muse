import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryChip({ href, label, active }: { href: string; label: string; active?: boolean; }) {
  return <Link href={href} className={cn("rounded-full border px-4 py-2 text-sm transition", active ? "border-gold-400 bg-gold-400/10 text-gold-300" : "border-white/10 bg-white/5 text-white/70 hover:text-white")}>{label}</Link>;
}
