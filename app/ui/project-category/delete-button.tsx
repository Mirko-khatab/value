"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProjectCategory } from "@/app/lib/actions";
import { useState } from "react";

export default function DeleteProjectCategoryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProjectCategory(id);
    } catch (error: any) {
      alert(error.message || "Failed to delete project category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}



