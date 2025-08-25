"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteMachineGroup } from "@/app/lib/actions";

export function CreateMachineGroup() {
  return (
    <Link
      href="/dashboard/machine-groups/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Machine Group</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMachineGroup({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/machine-groups/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteMachineGroup({ id }: { id: string }) {
  const deleteMachineGroupWithId = async (formData: FormData) => {
    try {
      await deleteMachineGroup(id);
      // If successful, redirect or refresh
      window.location.href = "/dashboard/machine-groups";
    } catch (error) {
      // Show user-friendly error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete machine group";
      alert(errorMessage);
    }
  };

  return (
    <>
      <form action={deleteMachineGroupWithId}>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100"
          onClick={(e) => {
            if (
              !confirm(
                "Are you sure you want to delete this machine group? This action cannot be undone."
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
