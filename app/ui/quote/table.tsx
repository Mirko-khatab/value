import { UpdateQuote, DeleteQuote } from "@/app/ui/quote/buttons";
import { fetchFilteredQuotes } from "@/app/lib/data";
import Image from "next/image";

// Utility function to truncate text
function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export default async function QuotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const quotes = await fetchFilteredQuotes(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {quotes?.map((quote) => (
              <div
                key={quote.id}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-700 p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                        title={quote.title_en}
                      >
                        {truncateText(quote.title_en)}
                      </p>
                    </div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      title={quote.title_ku}
                    >
                      {truncateText(quote.title_ku)}
                    </p>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      title={quote.title_ar}
                    >
                      {truncateText(quote.title_ar)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateQuote id={quote.id} />
                    <DeleteQuote id={quote.id} />
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
                  Image
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700">
              {quotes?.map((quote) => (
                <tr
                  key={quote.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="px-4 py-3 pl-6 max-w-xs">
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      title={quote.title_en}
                    >
                      {truncateText(quote.title_en)}
                    </p>
                  </td>
                  <td
                    className="px-3 py-3 text-gray-900 dark:text-gray-100 max-w-xs"
                    title={quote.title_ku}
                  >
                    {truncateText(quote.title_ku)}
                  </td>
                  <td
                    className="px-3 py-3 text-gray-900 dark:text-gray-100 max-w-xs"
                    title={quote.title_ar}
                  >
                    {truncateText(quote.title_ar)}
                  </td>
                  <td className="px-3 py-3">
                    {quote.image_url ? (
                      <div className="flex items-center space-x-2">
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={quote.image_url}
                            alt={quote.title_en}
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
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateQuote id={quote.id} />
                      <DeleteQuote id={quote.id} />
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
