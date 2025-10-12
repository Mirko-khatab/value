"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = [];
  const totalPageNumbers = 7;

  if (totalPages <= totalPageNumbers) {
    for (let i = 1; i <= totalPages; i++) {
      allPages.push(i);
    }
  } else {
    const currentPageGroup = Math.ceil(currentPage / totalPageNumbers);
    const startPage = (currentPageGroup - 1) * totalPageNumbers + 1;
    const endPage = Math.min(startPage + totalPageNumbers - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      allPages.push(i);
    }
  }

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (page === 1) position = "first";
          else if (page === totalPages) position = "last";
          else if (page === currentPage) position = "single";
          else position = "middle";

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = classNames(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-blue-600 border-blue-600 text-white": isActive,
      "hover:bg-gray-100 dark:hover:bg-gray-700":
        !isActive && position !== "middle",
      "text-gray-300 dark:text-gray-600": position === "middle",
    }
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <a href={href} className={className}>
      {page}
    </a>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = classNames(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300 dark:text-gray-600": isDisabled,
      "hover:bg-gray-100 dark:hover:bg-gray-700": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <a className={className} href={href}>
      {icon}
    </a>
  );
}

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
