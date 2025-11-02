import { Suspense } from "react";
import { fetchSubCategories } from "@/app/lib/data";
import {
  CreateSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
} from "@/app/ui/sub-category/buttons";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  const subCategories = await fetchSubCategories();

  return (
    <div className="w-full ">
      <div className="flex w-full items-center justify-between text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <h1 className="text-2xl">Sub Categories</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <CreateSubCategory />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-6 flow-root text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0 text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:bg-gray-700">
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
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
                <tbody className="bg-white text-gray-900  transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                  {subCategories?.map((subCategory) => (
                    <tr
                      key={subCategory.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 [&:hover>td]:bg-gray-100 dark:[&:hover>td]:bg-gray-600 "
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {subCategory.category_name_en || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {subCategory.title_en}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {subCategory.title_ku}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {subCategory.title_ar}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateSubCategory id={subCategory.id} />
                          <DeleteSubCategory id={subCategory.id} />
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

