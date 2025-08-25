import {
  UpdateMachineGroup,
  DeleteMachineGroup,
} from "@/app/ui/machine-groups/buttons";
import { fetchFilteredMachineGroups } from "@/app/lib/data";

export default async function MachineGroupsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const machineGroups = await fetchFilteredMachineGroups(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {machineGroups?.map((group) => (
              <div
                key={group.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">{group.title_en}</p>
                    </div>
                    <p className="text-sm text-gray-500">{group.title_ku}</p>
                    <p className="text-sm text-gray-500">{group.title_ar}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {group.machine_count} machines
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateMachineGroup id={group.id} />
                    <DeleteMachineGroup id={group.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Machines Count
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {machineGroups?.map((group) => (
                <tr
                  key={group.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3 pl-6">
                    <p className="font-medium">{group.title_en}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.title_ku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.title_ar}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {group.machine_count} machines
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMachineGroup id={group.id} />
                      <DeleteMachineGroup id={group.id} />
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
