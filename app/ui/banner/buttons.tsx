"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteBanner } from "@/app/lib/actions";

export function CreateBanner() {
  return (
    <Link
      href="/dashboard/banners/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Banner</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBanner({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/banners/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBanner({ id }: { id: string }) {
  const deleteBannerWithId = deleteBanner.bind(null, id);

  return (
    <form action={deleteBannerWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
