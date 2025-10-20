"use client";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteGraphic } from "@/app/lib/actions";

export function CreateGraphic() {
  return (
    <Link
      href="/dashboard/graphics/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Graphics</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteGraphic({ id }: { id: string }) {
  const deleteGraphicWithId = deleteGraphic.bind(null, id);

  return (
    <form action={deleteGraphicWithId}>
      <button
        type="submit"
        className="rounded-full bg-red-600 p-2.5 text-white shadow-lg hover:bg-red-700 transition-colors"
        title="Delete graphic"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 h-5" />
      </button>
    </form>
  );
}
