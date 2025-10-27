import Pagination from "@/app/ui/blogs/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/event/table";
import { CreateEvent } from "@/app/ui/event/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchTotalEventsPages } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTotalEventsPages(query);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Events", href: "/dashboard/event", active: true },
        ]}
      />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Events
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search events..." />
        <CreateEvent />
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
