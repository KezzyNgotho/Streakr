"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/streaks", label: "Streaks", icon: "🔥" },
  { href: "/add", label: "Add", icon: "➕" },
  { href: "/explore", label: "Explore", icon: "🔍" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg flex justify-around items-center h-16 rounded-t-2xl max-w-full mx-auto md:hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.href === "/" && pathname === "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold transition-colors ${active ? "text-primary" : "text-light"}`}
            aria-current={active ? "page" : undefined}
          >
            <span className={`text-2xl mb-1 ${active ? "" : "opacity-70"}`}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
} 