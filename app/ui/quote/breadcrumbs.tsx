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
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <HomeIcon className="w-4" />
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center space-x-3">
            <ChevronRightIcon className="w-4 text-gray-500" />
            <Link
              href={breadcrumb.href}
              className={`text-sm font-medium ${
                breadcrumb.active
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-900 hover:text-gray-700"
              }`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
