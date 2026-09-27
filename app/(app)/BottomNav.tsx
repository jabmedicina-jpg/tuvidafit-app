"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: "home" },
  { href: "/menu", label: "Menú", icon: "menu" },
  { href: "/compras", label: "Compras", icon: "cart" },
  { href: "/progreso", label: "Progreso", icon: "progress" },
  { href: "/recetas", label: "Recetas", icon: "book" },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#12A9B3" : "#66767A";
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"></path>
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M12 3v18M8 3c0 4 0 6-3 7 0 0 0 8 0 8M16 3c0 4 0 6 3 7 0 0 0 8 0 8"></path>
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M4 6h2l1.6 9.6a2 2 0 002 1.4h7.1a2 2 0 002-1.6L20 8H6.4"></path>
          <circle cx="10" cy="20" r="1.3"></circle>
          <circle cx="17" cy="20" r="1.3"></circle>
        </svg>
      );
    case "progress":
      return (
        <svg {...common}>
          <path d="M4 19V10M12 19V5M20 19v-6"></path>
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M5 4.5A1.5 1.5 0 016.5 3H15l4 4v13.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 20.5z"></path>
          <path d="M15 3v4h4M9 12h6M9 16h6"></path>
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line flex items-center justify-around px-2 py-2.5">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-2"
          >
            <Icon name={item.icon} active={!!active} />
            <span
              className={`text-[10.5px] ${
                active ? "text-teal font-semibold" : "text-muted"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
