import { fetchFilteredSpecialProjects } from "@/app/lib/data";
import { SpecialProjects } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteSpecialProject, UpdateSpecialProject } from "./button";

export default async function SpecialProjectsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const specialProjects = await fetchFilteredSpecialProjects(
    query,
    currentPage
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 text-gray-900"
            >
              Image
            </th>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 text-gray-900"
            >
              Sort Order
            </th>
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 text-center text-gray-900"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {specialProjects.map((project) => (
            <tr key={project.id} className="border-b">
              <td className="whitespace-nowrap px-4 py-5 sm:pl-6">
                <Image
                  src={project.image_url}
                  alt={`Special project ${project.id}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="whitespace-nowrap px-4 py-5 sm:pl-6">
                {project.sort_order}
              </td>
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-center gap-3">
                  <UpdateSpecialProject id={project.id} />
                  <DeleteSpecialProject id={project.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
