import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex text-xl md:text-2xl">
        <li className="mr-3">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <HomeIcon className="w-4" />
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center space-x-3">
            <ChevronRightIcon className="w-4 text-gray-500 dark:text-gray-400" />
            <Link
              href={breadcrumb.href}
              className={`text-sm font-medium transition-colors ${
                breadcrumb.active
                  ? "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  : "text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-current={breadcrumb.active ? "page" : undefined}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
