"use client";

import Link from "next/link";
import { useLanguage } from "@/app/lib/language-context";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { language, t } = useLanguage();

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <HomeIcon className="h-4 w-4" />
        <span className={`${isRTL ? "mr-1" : "ml-1"}`}>
          {t("home", {
            en: "Home",
            ar: "الرئيسية",
            ku: "سەرەتا",
          })}
        </span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center ${isRTL ? "space-x-reverse" : ""}`}
        >
          {/* Separator */}
          <ChevronRightIcon
            className={`h-4 w-4 text-gray-400 ${
              isRTL ? "rotate-180 mr-1" : "mx-1"
            }`}
          />

          {/* Breadcrumb Item */}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}


























