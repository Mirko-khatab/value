import Image from "next/image";
import Link from "next/link";
import { UpdateMachine, DeleteMachine } from "@/app/ui/products/buttons";
import { fetchFilteredMachines } from "@/app/lib/data";

export default async function MachinesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const machines = await fetchFilteredMachines(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {machines?.map((machine, index) => (
              <div
                key={`mobile-${machine.id}-${index}`}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {machine.gallery_image_url ? (
                        <Image
                          src={machine.gallery_image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={machine.gallery_alt_text || "Machine image"}
                        />
                      ) : (
                        <div className="mr-2 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">?</span>
                        </div>
                      )}
                      <Link
                        href={`/dashboard/machines/${machine.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {machine.title_en}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      {machine.description_en}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {machine.gallery_order_index}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order: {machine.gallery_order_index || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateMachine id={machine.id} />
                    <DeleteMachine id={machine.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Machine
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
              {machines?.map((machine, index) => (
                <tr
                  key={`table-${machine.id}-${index}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {machine.gallery_image_url ? (
                        <Image
                          src={machine.gallery_image_url}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={machine.gallery_alt_text || "Machine image"}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">?</span>
                        </div>
                      )}
                      <Link
                        href={`/dashboard/machines/${machine.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {machine.title_en}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="max-w-xs truncate">
                      {machine.description_en}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {machine.gallery_order_index}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {machine.gallery_order_index || "N/A"}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMachine id={machine.id} />
                      <DeleteMachine id={machine.id} />
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
