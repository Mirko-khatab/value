import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteAudio } from "@/app/lib/actions";

export function CreateAudio() {
  return (
    <Link
      href="/dashboard/audios/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Audio</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateAudio({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/audios/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteAudio({ id }: { id: string }) {
  const deleteAudioWithId = deleteAudio.bind(null, id);

  return (
    <form action={deleteAudioWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-red-500" />
      </button>
    </form>
  );
}
