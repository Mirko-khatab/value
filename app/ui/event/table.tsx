import Image from "next/image";
import Link from "next/link";
import { UpdateEvent, DeleteEvent } from "@/app/ui/event/buttons";
import { fetchFilteredEvents } from "@/app/lib/data";

export default async function EventsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const event = await fetchFilteredEvents(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {event?.map((event) => (
              <div
                key={event.id}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-700 p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {event.gallery_image_url && (
                        <Image
                          src={event.gallery_image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={event.gallery_alt_text || event.title_en}
                        />
                      )}
                      <Link
                        href={`/dashboard/event/${event.id}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600 hover:underline"
                      >
                        {event.title_en}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.description_en}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateEvent id={event.id} />
                    <DeleteEvent id={event.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal dark:text-white">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Event
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kurdish Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Arabic Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  English Title
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              {event?.map((event) => (
                <tr
                  key={event.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg dark:border-gray-600"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {event.gallery_image_url ? (
                        <Image
                          src={event.gallery_image_url}
                          className="rounded-lg"
                          width={56}
                          height={56}
                          alt={event.gallery_alt_text || event.title_en}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/event/${event.id}`}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600 hover:underline"
                        >
                          {event.title_en}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {event.description_en}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {event.title_ku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {event.title_ar}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {event.title_en}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateEvent id={event.id} />
                      <DeleteEvent id={event.id} />
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
