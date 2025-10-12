import { UpdateAudio, DeleteAudio } from "@/app/ui/audio/buttons";
import { Audio } from "@/app/lib/definitions";
import {
  MusicalNoteIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default async function AudiosTable({ audios }: { audios: Audio[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {audios?.map((audio) => (
              <div
                key={audio.id}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-700 p-4"
              >
                <div className="flex items-center justify-between border-b dark:border-gray-600 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <MusicalNoteIcon className="w-5 h-5 mr-2 text-blue-500" />
                      <p className="text-sm font-medium dark:text-white">
                        {audio.title_en}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use For: {audio.use_for}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {audio.is_active ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex-1">
                    <audio controls className="w-full max-w-xs">
                      <source src={audio.audio_url} type="audio/mpeg" />
                    </audio>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateAudio id={audio.id} />
                    <DeleteAudio id={audio.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 dark:text-gray-100 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title (EN)
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title (KU)
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title (AR)
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Audio Preview
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Use For
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700">
              {audios?.map((audio) => (
                <tr
                  key={audio.id}
                  className="w-full border-b dark:border-gray-600 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {audio.title_en}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {audio.title_ku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3" dir="rtl">
                    {audio.title_ar}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <audio controls className="w-48">
                      <source src={audio.audio_url} type="audio/mpeg" />
                    </audio>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {audio.use_for}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {audio.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                        <CheckCircleIcon className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-600 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                        <XCircleIcon className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAudio id={audio.id} />
                      <DeleteAudio id={audio.id} />
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
