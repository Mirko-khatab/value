"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteLocation } from "@/app/lib/actions";
import { useState } from "react";

export default function DeleteLocationButton({
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
      await deleteLocation(id);
    } catch (error: any) {
      alert(error.message || "Failed to delete location");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
