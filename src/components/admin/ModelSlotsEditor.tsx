"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ImageIcon, Edit2, Check } from "lucide-react";
import { MediaUpload } from "./media-upload";
import {
  upsertModelSlot,
  addModelSlotItem,
  deleteModelSlotItem,
  updateModelSlotItem,
  deleteModelSlot,
} from "@/lib/supabase/content-actions";

interface SlotItem {
  id: string;
  image_url: string | null;
  caption: string | null;
  order_index: number;
}

interface ModelSlotData {
  id: string | null;
  slot_index: number;
  cover_image_url: string | null;
  title: string | null;
  items: SlotItem[];
}

interface ModelSlotsEditorProps {
  heroRoomId: string;
  slots: ModelSlotData[];
}

export function ModelSlotsEditor({ heroRoomId, slots }: ModelSlotsEditorProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState("");
  const [editingSlotTitle, setEditingSlotTitle] = useState<number | null>(null);
  const [slotTitleValue, setSlotTitleValue] = useState("");

  const allSlots: ModelSlotData[] = [0, 1, 2].map((i) => {
    const raw = slots.find((s) => s.slot_index === i) ?? {
      id: null,
      slot_index: i,
      cover_image_url: null,
      title: null,
      items: [],
    };
    return {
      ...raw,
      items: raw.items ?? (raw as any).model_images ?? [],
    };
  });

  async function handleCoverUpload(slotIndex: number, url: string) {
    const key = `cover-${slotIndex}`;
    setBusy(key);
    setErrors((e) => ({ ...e, [key]: "" }));
    const fd = new FormData();
    fd.set("hero_room_id", heroRoomId);
    fd.set("slot_index", String(slotIndex));
    fd.set("cover_image_url", url);
    const result = await upsertModelSlot(fd);
    if (result?.error) setErrors((e) => ({ ...e, [key]: result.error! }));
    setBusy(null);
    router.refresh();
  }

  async function handleAddItem(slot: ModelSlotData, url: string) {
    const key = `item-${slot.slot_index}`;
    setBusy(key);
    setErrors((e) => ({ ...e, [key]: "" }));

    let slotId = slot.id;
    if (!slotId) {
      const fd = new FormData();
      fd.set("hero_room_id", heroRoomId);
      fd.set("slot_index", String(slot.slot_index));
      const result = await upsertModelSlot(fd);
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
    const result = await addModelSlotItem(fd);
    if (result?.error) setErrors((e) => ({ ...e, [key]: result.error! }));
    setBusy(null);
    router.refresh();
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    await deleteModelSlotItem(id);
    router.refresh();
  }

  async function handleDeleteSlot(slot: ModelSlotData) {
    if (!slot.id) return;
    if (!confirm("¿Eliminar esta portada y todas sus imágenes?")) return;
    await deleteModelSlot(slot.id);
    router.refresh();
  }

  function startEditCaption(item: SlotItem) {
    setEditingCaption(item.id);
    setCaptionValue(item.caption ?? "");
  }

  async function saveCaption(itemId: string) {
    const fd = new FormData();
    fd.set("item_id", itemId);
    fd.set("caption", captionValue);
    await updateModelSlotItem(fd);
    setEditingCaption(null);
    setCaptionValue("");
    router.refresh();
  }

  async function saveSlotTitle(slotIndex: number) {
    const fd = new FormData();
    fd.set("hero_room_id", heroRoomId);
    fd.set("slot_index", String(slotIndex));
    fd.set("title", slotTitleValue);
    await upsertModelSlot(fd);
    setEditingSlotTitle(null);
    setSlotTitleValue("");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {allSlots.map((slot) => {
        const coverKey = `cover-${slot.slot_index}`;
        const itemKey = `item-${slot.slot_index}`;
        return (
          <div
            key={slot.slot_index}
            className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between">
              {editingSlotTitle === slot.slot_index ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={slotTitleValue}
                    onChange={(e) => setSlotTitleValue(e.target.value)}
                    placeholder={`Título de portada ${slot.slot_index + 1}`}
                    className="rounded border border-white/20 bg-black/50 px-2 py-1 text-sm text-white placeholder:text-white/30 focus:border-violet-400 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveSlotTitle(slot.slot_index);
                      if (e.key === "Escape") setEditingSlotTitle(null);
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => saveSlotTitle(slot.slot_index)}
                    className="rounded bg-violet-600 p-1.5 text-white hover:bg-violet-500"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setEditingSlotTitle(null)}
                    className="rounded bg-white/10 p-1.5 text-white hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <p className="text-lg font-semibold text-violet-300">
                  <ImageIcon className="mr-2 inline h-5 w-5" />
                  {slot.title ?? `Portada ${slot.slot_index + 1}`}
                  <button
                    onClick={() => {
                      setEditingSlotTitle(slot.slot_index);
                      setSlotTitleValue(slot.title ?? "");
                    }}
                    className="ml-2 inline-flex items-center text-xs text-violet-400 hover:text-violet-300"
                    title="Editar título"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </p>
              )}
              {slot.id && (
                <button
                  onClick={() => handleDeleteSlot(slot)}
                  className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                >
                  Eliminar portada
                </button>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/70">Imagen de portada</p>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-white/10 bg-black/40">
                  {slot.cover_image_url ? (
                    <Image
                      src={slot.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-white/30">
                      <ImageIcon className="h-12 w-12" />
                      <span>Sin portada</span>
                    </div>
                  )}
                </div>

                <MediaUpload
                  folder="model-slots"
                  onUploaded={(url) => handleCoverUpload(slot.slot_index, url)}
                  accept="image/*"
                  label={busy === coverKey ? "Guardando…" : "Subir/Cambiar portada"}
                />
                {errors[coverKey] && (
                  <p className="text-xs text-rose-400">{errors[coverKey]}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">
                    Imágenes del carrusel ({slot.items.length})
                  </p>
                  <MediaUpload
                    folder="model-slots"
                    onUploaded={(url) => handleAddItem(slot, url)}
                    accept="image/*"
                    label={busy === itemKey ? "Añadiendo…" : "+ Añadir imagen"}
                  />
                </div>

                {errors[itemKey] && (
                  <p className="text-xs text-rose-400">{errors[itemKey]}</p>
                )}

                {slot.items.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/20">
                    <p className="text-sm text-white/30">No hay imágenes en el carrusel</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {slot.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30"
                      >
                        <div className="flex gap-3 p-3">
                          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-black/50">
                            {item.image_url && (
                              <Image
                                src={item.image_url}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start gap-2">
                              <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                                #{idx + 1}
                              </span>
                            </div>

                            {editingCaption === item.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={captionValue}
                                  onChange={(e) => setCaptionValue(e.target.value)}
                                  placeholder="Caption (opcional)"
                                  className="w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-sm text-white placeholder:text-white/30 focus:border-violet-400 focus:outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveCaption(item.id);
                                    if (e.key === "Escape") setEditingCaption(null);
                                  }}
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => saveCaption(item.id)}
                                    className="rounded bg-violet-600 px-2 py-1 text-xs text-white hover:bg-violet-500"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingCaption(null)}
                                    className="rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {item.caption ? (
                                  <p className="line-clamp-2 text-xs text-white/70">
                                    {item.caption}
                                  </p>
                                ) : (
                                  <p className="text-xs italic text-white/30">Sin caption</p>
                                )}
                                <button
                                  onClick={() => startEditCaption(item)}
                                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  Editar
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex-shrink-0 self-start rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-300 transition-all hover:bg-red-500/40"
                            title="Eliminar"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
