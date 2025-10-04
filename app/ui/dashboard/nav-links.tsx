"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { links } from "@/app/lib/utils";
import { useLoading } from "@/app/lib/loading-context";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export default function NavLinks() {
  const pathname = usePathname();
  const { showLoading } = useLoading();

  const handleNavigation = (href: string) => {
    // Only show loading if navigating to a different page
    if (href !== pathname) {
      showLoading();
    }
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => handleNavigation(link.href)}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors duration-200",
              {
                "bg-sky-100 dark:bg-gray-600 text-blue-600 dark:text-blue-400":
                  pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
