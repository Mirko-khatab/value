import { fetchCustomers } from "@/app/lib/data";
import { TeamField } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteTeam, UpdateTeam } from "./button";

export default async function TeamsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const teams = await fetchCustomers();
  const data = [
    "name_ku",
    "name_ar",
    "name_en",
    "position_ku",
    "position_ar",
    "position_en",
    "image_url",
  ];

  return (
    <div className="overflow-x-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-100 transition-colors duration-200">
        <thead className="rounded-lg text-left text-sm font-normal text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <tr>
            {data.map((item) => (
              <th
                scope="col"
                key={item}
                className="px-4 py-5 font-medium sm:pl-6  text-gray-900"
              >
                {item}
              </th>
            ))}
            <th
              scope="col"
              className="px-4 py-5 font-medium sm:pl-6 text-center text-gray-900"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-200">
          {teams.map((team) => (
            <tr
              key={team.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:border-gray-600 [&:hover>td]:bg-gray-100 dark:[&:hover>td]:bg-gray-600 [&:hover>td]:text-gray-900 dark:[&:hover>td]:text-gray-100       "
            >
              {data.map((item) => (
                <td key={item} className="whitespace-nowrap px-4 py-5 sm:pl-6">
                  {item === "image_url" ? (
                    <Image
                      src={team.image_url}
                      alt={`${team.name_ku}'s profile picture`}
                      width={32}
                      height={32}
                      className="w-10 h-10"
                    />
                  ) : (
                    team[item as keyof TeamField]
                  )}
                </td>
              ))}
              <td className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="flex justify-center gap-3">
                  <UpdateTeam id={team.id} />
                  <DeleteTeam id={team.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
