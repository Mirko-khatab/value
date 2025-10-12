"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/value-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { handleSignOut } from "@/app/lib/actions";
import { useLoading } from "@/app/lib/loading-context";

export default function SideNav() {
  const { showLoading } = useLoading();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <Link
        className="mb-2 flex h-22 items-end justify-start rounded-md bg-blue-600 dark:bg-blue-700 md:h-52 transition-colors duration-200"
        href="/"
        onClick={() => showLoading()}
      >
        <div className=" flex h-full  w-full items-center justify-center text-white ">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 overflow-x-auto scrollbar-hide py-4">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-700 md:block transition-colors duration-200"></div>
        <form action={handleSignOut}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors duration-200">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
