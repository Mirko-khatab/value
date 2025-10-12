import { UpdateBanner, DeleteBanner } from "@/app/ui/banner/buttons";
import { fetchFilteredBanners } from "@/app/lib/data";
import Image from "next/image";

export default async function BannersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const banners = await fetchFilteredBanners(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {banners?.map((banner) => (
              <div
                key={banner.id}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-700 p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {banner.title_en}
                      </p>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          banner.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {banner.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {banner.title_ku}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {banner.title_ar}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Type: {banner.type} | Order: {banner.sort_order}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateBanner id={banner.id} />
                    <DeleteBanner id={banner.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 dark:text-gray-100 md:table">
            <thead className="rounded-lg text-left text-sm font-normal bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-5 font-medium sm:pl-6 text-gray-900 dark:text-white"
                >
                  English Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Kurdish Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Arabic Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 font-medium text-gray-900 dark:text-white"
                >
                  Order
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700">
              {banners?.map((banner) => (
                <tr
                  key={banner.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3 pl-6">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {banner.title_en}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-gray-100">
                    {banner.title_ku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-900 dark:text-gray-100">
                    {banner.title_ar}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        banner.type === "image"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      }`}
                    >
                      {banner.type}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {banner.image_url ? (
                      <div className="flex items-center space-x-2">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={banner.image_url}
                            alt={banner.title_en}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-green-600 dark:text-green-400 text-sm">
                          ✓ Uploaded
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        banner.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-900 dark:text-gray-100">
                    {banner.sort_order}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBanner id={banner.id} />
                      <DeleteBanner id={banner.id} />
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
