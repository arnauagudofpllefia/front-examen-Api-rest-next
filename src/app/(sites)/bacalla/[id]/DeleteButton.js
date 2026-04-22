"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBacalla } from "@/lib/api";

export default function DeleteButton({ id }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Segur que vols eliminar aquesta varietat?")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteBacalla(id);
      router.push("/bacalla");
      router.refresh();
    } catch (err) {
      setError(err.message || "No s'ha pogut eliminar la varietat.");
      setDeleting(false);
    }
  }

  return (
    <>
      {error && (
        <span className="text-red-400 text-xs">{error}</span>
      )}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? "Eliminant..." : "Eliminar"}
      </button>
    </>
  );
}
