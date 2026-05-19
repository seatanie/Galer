"use client";

import { Trash2 } from "lucide-react";
import { deleteGallery } from "@/lib/supabase/content-actions";
import { useRouter } from "next/navigation";

export function DeleteGalleryButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm("¿Eliminar esta galería?")) return;
        await deleteGallery(id);
        router.refresh();
      }}
      className="rounded-lg p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
