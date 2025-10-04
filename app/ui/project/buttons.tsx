import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteProject } from "@/app/lib/actions";

export function CreateProject() {
  return (
    <Link
      href="/dashboard/projects/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 dark:bg-blue-700 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500"
    >
      <span className="hidden md:block">Create Project</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProject({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/projects/${id}/edit`}
      className="rounded-md border border-gray-200 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProject({ id }: { id: string }) {
  const deleteProjectWithId = deleteProject.bind(null, id);

  return (
    <>
      <form action={deleteProjectWithId}>
        <button
          type="submit"
          className="rounded-md border border-gray-200 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
