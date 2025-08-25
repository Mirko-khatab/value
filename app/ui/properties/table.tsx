import { UpdateProperty, DeleteProperty } from "@/app/ui/properties/button";
import { fetchFilteredProperties } from "@/app/lib/data";

export default async function PropertiesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const properties = await fetchFilteredProperties(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {properties?.map((property) => (
              <div
                key={property.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">{property.key}</p>
                    </div>
                    <p className="text-sm text-gray-500">{property.value_en}</p>
                    <p className="text-sm text-gray-500">{property.value_ku}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="max-w-[200px] truncate">
                    <p className="text-sm text-gray-600">{property.value_ar}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProperty id={property.id} />
                    <DeleteProperty id={property.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Property Key
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Value (English)
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Value (Kurdish)
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Value (Arabic)
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {properties?.map((property) => (
                <tr
                  key={property.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3 pl-6">
                    <p className="font-medium">{property.key}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {property.value_en}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {property.value_ku}
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-[300px] truncate">
                      {property.value_ar}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProperty id={property.id} />
                      <DeleteProperty id={property.id} />
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
