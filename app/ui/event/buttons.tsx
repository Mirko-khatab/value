import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteBlog } from "@/app/lib/actions";

export function CreateEvent() {
  return (
    <Link
      href="/dashboard/event/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500"
    >
      <span className="hidden md:block">Create Event</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEvent({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/event/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />
    </Link>
  );
}

export function DeleteEvent({ id }: { id: string }) {
  const deleteBlogWithId = deleteBlog.bind(null, id);

  return (
    <form action={deleteBlogWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-red-500 dark:text-red-400" />
      </button>
    </form>
  );
}
