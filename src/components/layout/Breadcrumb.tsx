import Link from "next/link";

interface Item { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ghost mb-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-ghost/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-clean transition-colors duration-150">
              {item.label}
            </Link>
          ) : (
            <span className="text-clean">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
