import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "../ui/utils/space";
import CustomeCard from "../ui/home/custom-card";
import { Machine, MachineGroup } from "@/app/lib/definitions";
import {
  fetchMachines,
  fetchMachineGroups,
  fetchMachinesByGroup,
} from "@/app/lib/data";
import Link from "next/link";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export default async function Page(props: {
  searchParams: Promise<{ groupId?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Server-side data fetching with proper error handling
  const [machines, machineGroups] = await Promise.all([
    searchParams.groupId
      ? fetchMachinesByGroup(searchParams.groupId)
      : fetchMachines(),
    fetchMachineGroups(),
  ]);

  const filteredMachines = machines.filter((machine) => {
    if (!searchParams.search) return true;
    const searchTerm = searchParams.search.toLowerCase();
    return (
      machine.title_en?.toLowerCase().includes(searchTerm) ||
      machine.title_ar?.toLowerCase().includes(searchTerm) ||
      machine.title_ku?.toLowerCase().includes(searchTerm)
    );
  });

  const organizeInColumns = (machines: Machine[]) => {
    const columns: Machine[][] = [[], []];

    machines.forEach((machine, index) => {
      const columnIndex = Math.floor(index / 4) % 2;
      columns[columnIndex].push(machine);
    });

    return columns;
  };

  const getCardType = (index: number): number => {
    // Every 4th card starting from index 0 should be type 1
    return index % 4 === 0 ? 1 : 2;
  };

  const organizedMachines = organizeInColumns(filteredMachines);

  return (
    <ShowcaseLayout>
      <Space className="flex flex-col gap-8 page-entrance">
        <div>
          {/* Search form - server-side rendered */}
          <form method="GET" className="w-full sm:w-1/2">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchParams.search || ""}
              className="w-full rounded-md p-2 border transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </form>
        </div>
        <div className="flex flex-row gap-4 scrollbar-hide overflow-x-auto">
          <Link
            href="/product"
            className={`px-4 py-2 rounded-md transition-all duration-300 enhanced-hover ${
              !searchParams.groupId
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All Products
          </Link>
          {machineGroups.map((group, groupIndex) => (
            <Link
              key={group.id}
              href={`/product?groupId=${group.id}`}
              className={`px-4 py-2 rounded-md transition-all duration-300 enhanced-hover animation-delay-${Math.min(
                groupIndex * 100,
                500
              )} ${
                searchParams.groupId === group.id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {group.title_en || group.title_ar || group.title_ku}
            </Link>
          ))}
        </div>
      </Space>
      <Space className="flex flex-col sm:flex-row gap-8 justify-start">
        {organizedMachines.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((machine, machineIndex) => {
              const globalIndex =
                columnIndex * Math.ceil(filteredMachines.length / 2) +
                machineIndex;
              return (
                <Link key={machine.id} href={`/product/${machine.id}`}>
                  <CustomeCard
                    title={
                      machine.title_en || machine.title_ar || machine.title_ku
                    }
                    image_url={machine.gallery_image_url || "/image/2.jpg"}
                    width={400}
                    height={300}
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </Space>
    </ShowcaseLayout>
  );
}
