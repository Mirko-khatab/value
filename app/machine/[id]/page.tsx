import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "@/app/ui/utils/space";
import { Machine, Gallery } from "@/app/lib/definitions";
import { fetchMachineById, fetchMachineGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";
import MachineGalleryClient from "./machine-gallery-client";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const machineId = params.id;

  // Server-side data fetching
  const [machines, galleries] = await Promise.all([
    fetchMachineById(machineId),
    fetchMachineGalleries(machineId),
  ]);

  if (machines.length === 0) {
    notFound();
  }

  const machine = machines[0];

  return (
    <ShowcaseLayout>
      <Space className="flex sm:flex-row justify-between sm:items-start items-center flex-col gap-8">
        <div className="flex flex-col gap-4 w-full sm:w-1/2">
          <h1 className="sm:text-2xl text-xl font-bold">
            {machine.title_en || machine.title_ar || machine.title_ku}
          </h1>
          <p>
            {machine.description_en ||
              machine.description_ar ||
              machine.description_ku}
          </p>
        </div>
        <MachineGalleryClient galleries={galleries} />
      </Space>
    </ShowcaseLayout>
  );
}
