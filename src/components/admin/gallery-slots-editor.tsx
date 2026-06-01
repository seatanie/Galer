"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { MediaUpload } from "./media-upload";
import { upsertGallerySlot, addSlotItem, deleteSlotItem } from "@/lib/supabase/content-actions";

interface SlotItem {
  id: string;
  image_url: string | null;
  title: string | null;
  order_index: number;
}

interface GallerySlotData {
  id: string | null;
  slot_index: number;
  cover_image_url: string | null;
  title: string | null;
  items: SlotItem[];
}

interface GallerySlotsEditorProps {
  galleryId: string;
  slots: GallerySlotData[];
}

const SLOT_LABELS = ["Foto principal 1", "Foto principal 2", "Foto principal 3"];

export function GallerySlotsEditor({ galleryId, slots }: GallerySlotsEditorProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allSlots: GallerySlotData[] = [0, 1, 2].map((i) => {
    return slots.find((s) => s.slot_index === i) ?? {
      id: null,
      slot_index: i,
      cover_image_url: null,
      title: null,
      items: [],
    };
  });

  async function handleCoverUpload(slotIndex: number, url: string) {
    const key = `cover-${slotIndex}`;
    setBusy(key);
    setErrors((e) => ({ ...e, [key]: "" }));
    const fd = new FormData();
    fd.set("gallery_id", galleryId);
    fd.set("slot_index", String(slotIndex));
    fd.set("cover_image_url", url);
    const result = await upsertGallerySlot(fd);
    if (result?.error) setErrors((e) => ({ ...e, [key]: result.error! }));
    setBusy(null);
    router.refresh();
  }

  async function handleAddItem(slot: GallerySlotData, url: string) {
    const key = `item-${slot.slot_index}`;
    setBusy(key);
    setErrors((e) => ({ ...e, [key]: "" }));

    let slotId = slot.id;
    if (!slotId) {
      const fd = new FormData();
      fd.set("gallery_id", galleryId);
      fd.set("slot_index", String(slot.slot_index));
      const result = await upsertGallerySlot(fd);
      if (result?.error || !result?.id) {
        setErrors((e) => ({ ...e, [key]: result?.error ?? "Error creando slot" }));
        setBusy(null);
        return;
      }
      slotId = result.id;
    }

    const fd = new FormData();
    fd.set("slot_id", slotId!);
    fd.set("image_url", url);
    const result = await addSlotItem(fd);
    if (result?.error) setErrors((e) => ({ ...e, [key]: result.error! }));
    setBusy(null);
    router.refresh();
  }

  async function handleDeleteItem(id: string) {
    await deleteSlotItem(id);
    router.refresh();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {allSlots.map((slot) => {
        const coverKey = `cover-${slot.slot_index}`;
        const itemKey = `item-${slot.slot_index}`;
        return (
          <div
            key={slot.slot_index}
            className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-sm font-medium text-violet-300">{SLOT_LABELS[slot.slot_index]}</p>

            {/* Cover preview */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-black/30">
              {slot.cover_image_url ? (
                <Image src={slot.cover_image_url} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/20">
                  Sin portada
                </div>
              )}
            </div>

            <MediaUpload
              folder="galleries/slots"
              onUploaded={(url) => handleCoverUpload(slot.slot_index, url)}
              accept="image/*"
              label={busy === coverKey ? "Guardando…" : "Cambiar portada"}
            />
            {errors[coverKey] && (
              <p className="text-xs text-rose-400">{errors[coverKey]}</p>
            )}

            {/* Sub-imágenes del carrusel */}
            <div className="border-t border-white/10 pt-3">
              <p className="mb-2 text-xs text-white/40">
                Fotos del carrusel ({slot.items.length})
              </p>
              {slot.items.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-1">
                  {slot.items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-md bg-black/30"
                    >
                      {item.image_url && (
                        <Image src={item.image_url} alt="" fill className="object-cover" />
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Eliminar"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <MediaUpload
                folder="galleries/slots"
                onUploaded={(url) => handleAddItem(slot, url)}
                accept="image/*"
                label={busy === itemKey ? "Añadiendo…" : "+ Añadir foto"}
              />
              {errors[itemKey] && (
                <p className="mt-1 text-xs text-rose-400">{errors[itemKey]}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
