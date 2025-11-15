import { Suspense } from "react";
import { fetchFilteredBanners, fetchTotalBannersPages } from "@/app/lib/data";
import Pagination from "@/app/ui/banner/pagination";
import Search from "@/app/ui/banner/search";
import BannersTable from "@/app/ui/banner/table";
import { CreateBanner } from "@/app/ui/banner/buttons";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const totalPages = await fetchTotalBannersPages(query);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Banners", href: "/dashboard/banners", active: true },
        ]}
      />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search banners..." />
        <CreateBanner />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <BannersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
