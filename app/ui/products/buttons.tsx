import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteProduct } from "@/app/lib/actions";

export function CreateMachine() {
  return (
    <Link
      href="/dashboard/products/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Machine</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMachine({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />
    </Link>
  );
}

export function DeleteMachine({ id }: { id: string }) {
  const deleteProductWithId = deleteProduct.bind(null, id);

  return (
    <>
      <form action={deleteProductWithId}>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5 text-red-500 dark:text-red-400" />
        </button>
      </form>
    </>
  );
}
