import Image from "next/image";
import Link from "next/link";
import { UpdateProject, DeleteProject } from "@/app/ui/project/buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { fetchFilteredProjects } from "@/app/lib/data";

export default async function ProjectsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const projects = await fetchFilteredProjects(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {projects?.map((project, index) => (
              <div
                key={`mobile-${project.id}-${index}`}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {project.gallery_image_url ? (
                        <Image
                          src={project.gallery_image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={project.gallery_alt_text || "Project image"}
                        />
                      ) : (
                        <div className="mr-2 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">?</span>
                        </div>
                      )}
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {project.title_en}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      {project.description_en}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {typeof project.date === "string"
                        ? project.date
                        : (project.date as Date)
                            ?.toISOString?.()
                            ?.split("T")[0] || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order: {project.gallery_order_index || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProject id={project.id} />
                    <DeleteProject id={project.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Project
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Order
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projects?.map((project, index) => (
                <tr
                  key={`table-${project.id}-${index}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {project.gallery_image_url ? (
                        <Image
                          src={project.gallery_image_url}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={project.gallery_alt_text || "Project image"}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">?</span>
                        </div>
                      )}
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {project.title_en}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="max-w-xs truncate">
                      {project.description_en}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {typeof project.date === "string"
                      ? formatDateToLocal(project.date)
                      : (project.date as Date)
                          ?.toISOString?.()
                          ?.split("T")[0] || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {project.gallery_order_index || "N/A"}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProject id={project.id} />
                      <DeleteProject id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
