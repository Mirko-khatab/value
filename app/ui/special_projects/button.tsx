import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteSpecialProject } from "@/app/lib/actions";

export function CreateSpecialProject() {
  return (
    <Link
      href="/dashboard/special-projects/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Special Project</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSpecialProject({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/special-projects/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSpecialProject({ id }: { id: string }) {
  const deleteSpecialProjectWithId = deleteSpecialProject.bind(null, id);

  return (
    <>
      <form action={deleteSpecialProjectWithId}>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
