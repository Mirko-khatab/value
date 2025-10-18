import Pagination from "@/app/ui/products/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/products/table";
import { CreateMachine } from "@/app/ui/products/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchTotalProductsPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTotalProductsPages(query);

  return (
    <div className="w-full transition-colors duration-200">
      <div className="flex w-full items-center justify-between">
        <h1
          className={` text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-200`}
        >
          products
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateMachine />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
