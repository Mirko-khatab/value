import Pagination from "@/app/ui/social-media/pagination";
import Search from "@/app/ui/search";
import SocialMediaTable from "@/app/ui/social-media/table";
import { CreateSocialMedia } from "@/app/ui/social-media/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchTotalSocialMediaPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTotalSocialMediaPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Social Media</h1>
      </div>
      {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search social media..." />
        <CreateSocialMedia />
      </div> */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <SocialMediaTable query={query} currentPage={currentPage} />
      </Suspense>
      {/* <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}
