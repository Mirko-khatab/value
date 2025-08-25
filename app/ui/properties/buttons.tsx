"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteQuote } from "@/app/lib/actions";

export function CreateQuote() {
  return (
    <Link
      href="/dashboard/quote/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Quote</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateQuote({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/quote/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteQuote({ id }: { id: string }) {
  const deleteQuoteWithId = async (formData: FormData) => {
    try {
      await deleteQuote(id);
      // If successful, redirect or refresh
      window.location.href = "/dashboard/quote";
    } catch (error) {
      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete quote";
      alert(errorMessage);
    }
  };

  return (
    <>
      <form action={deleteQuoteWithId}>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100"
          onClick={(e) => {
            if (
              !confirm(
                "Are you sure you want to delete this quote? This action cannot be undone."
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
