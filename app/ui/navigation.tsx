"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useTheme } from "@/app/lib/theme-context";
import ThemeToggle from "./theme-toggle";

export default function Navigation() {
  const pathname = usePathname();
  const { colors, theme } = useTheme();

  const navItems = [
    { name: "Home", href: "/", key: 1 },
    { name: "|", href: "", key: 2 },
    { name: "About", href: "/about", key: 3 },
    { name: "|", href: "", key: 4 },
    { name: "Blog", href: "/blog", key: 5 },
    { name: "|", href: "", key: 6 },
    { name: "Machine", href: "/machine", key: 7 },
  ];

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 md:max-w-4xl max-w-2xl fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md  duration-200">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="font-bold">
              <Image src="/image/logo.png" alt="logo" width={70} height={70} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="font-bold flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Image src="/icons/lang.svg" alt="lang" width={20} height={20} />
              <span>EN</span>
            </Link>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`pl-4 py-2 md:text-[18px] sm:text-[16px] text-[14px] flex flex-row rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 "
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
