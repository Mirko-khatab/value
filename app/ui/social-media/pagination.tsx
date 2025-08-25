"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { generatePagination } from "@/app/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Generate pagination buttons
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={currentPage > 1 ? `?page=${currentPage - 1}` : ""}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let href = "";

          if (typeof page === "number") {
            href = `?page=${page}`;
          }

          return (
            <PageNumberButton
              key={page}
              href={href}
              page={page}
              position={
                index === 0
                  ? "first"
                  : index === allPages.length - 1
                  ? "last"
                  : "middle"
              }
              isActive={page === currentPage}
            />
          );
        })}
      </div>
      <PaginationArrow
        direction="right"
        href={currentPage < totalPages ? `?page=${currentPage + 1}` : ""}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PageNumberButton({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "bg-blue-600 text-white": isActive,
      "hover:bg-gray-100": !isActive && page !== "...",
      "text-gray-300": page === "...",
    }
  );

  if (page === "...") {
    return <div className={className}>...</div>;
  }

  return (
    <Link href={href} className={className}>
      {page}
    </Link>
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
  const className = `flex h-10 w-10 items-center justify-center rounded-md border
    ${
      isDisabled
        ? "pointer-events-none text-gray-300"
        : "text-gray-500 hover:bg-gray-100"
    } ${direction === "left" ? "mr-2 md:mr-4" : "ml-2 md:ml-4"}`;

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link href={href} className={className}>
      {icon}
    </Link>
  );
}
