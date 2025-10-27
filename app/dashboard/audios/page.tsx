import Search from "@/app/ui/search";
import AudiosTable from "@/app/ui/audio/table";
import { CreateAudio } from "@/app/ui/audio/buttons";
import { Suspense } from "react";
import { fetchFilteredAudios, fetchTotalAudiosPages } from "@/app/lib/data";
import Pagination from "@/app/ui/blogs/pagination";

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

  const totalPages = await fetchTotalAudiosPages(query);
  const audios = await fetchFilteredAudios(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audio Management
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search audios..." />
        <CreateAudio />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <AudiosTable audios={audios} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
