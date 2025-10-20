import { Suspense } from "react";
import { fetchProjectCategories } from "@/app/lib/data";
import {
  CreateProjectCategory,
  UpdateProjectCategory,
  DeleteProjectCategory,
} from "@/app/ui/project-category/buttons";

export default async function Page() {
  const categories = await fetchProjectCategories();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Project Categories</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateProjectCategory />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      English Title
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Kurdish Title
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Arabic Title
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {categories?.map((category) => (
                    <tr
                      key={category.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {category.title_en}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {category.title_ku}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {category.title_ar}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProjectCategory id={category.id} />
                          <DeleteProjectCategory id={category.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
