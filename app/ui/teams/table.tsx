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
  // const teams = await fetchFilteredTeams(query, currentPage);

  return (
    <div className="overflow-x-auto ">
      {/* <table className=" min-w-full overflow-x-auto scrollbar-hide 
       text-gray-900 md:table"> */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="rounded-lg text-left text-sm font-normal">
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
        <tbody className="bg-white">
          {teams.map((team) => (
            <tr key={team.id}>
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
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
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
