"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from "@/lib/supabase/content-actions";
import { MediaUpload } from "./media-upload";
import {
  Trash2,
  Image as ImageIcon,
  Pencil,
  X,
  GripVertical,
  Check,
} from "lucide-react";
import type { HeroSlide } from "@/types/supabase-content";

// ── Drag & drop ──
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  slides: HeroSlide[];
}

function SortableSlide({
  slide,
  editingId,
  onEdit,
  onDelete,
}: {
  slide: HeroSlide;
  editingId: string | null;
  onEdit: (s: HeroSlide) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: slide.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingId === slide.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
        isEditing
          ? "border-violet-500/50 bg-violet-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-white/30 hover:text-white/60">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <img src={slide.image_url} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{slide.title ?? "Sin título"}</p>
        {slide.description && (
          <p className="truncate text-xs text-white/40">{slide.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onEdit(slide)}
        className="rounded-lg p-2 text-white/40 hover:bg-violet-500/20 hover:text-violet-400"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(slide.id)}
        className="rounded-lg p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function HeroSlidesForm({ slides }: Props) {
  const router = useRouter();
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<HeroSlide | null>(null);

  const [ordered, setOrdered] = useState<HeroSlide[]>(slides);
  const [savingOrder, setSavingOrder] = useState(false);

  // Sync ordered state when slides prop changes
  const [prevSlides, setPrevSlides] = useState(slides);
  if (slides !== prevSlides) {
    setPrevSlides(slides);
    setOrdered(slides);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((s) => s.id === active.id);
    const newIndex = ordered.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(reordered);
    setSavingOrder(true);
    await reorderHeroSlides(reordered.map((s) => s.id));
    setSavingOrder(false);
  }

  function resetForm() {
    setEditing(null);
    setUploadedUrl("");
    setLinkUrl("");
    setError(null);
  }

  function startEdit(slide: HeroSlide) {
    setEditing(slide);
    setLinkUrl(slide.image_url);
    setUploadedUrl("");
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const finalUrl = uploadedUrl || linkUrl;
    if (!finalUrl) {
      setError("Pon una URL o sube un archivo");
      return;
    }
    formData.set("image_url", finalUrl);

    let result;
    if (editing) {
      result = await updateHeroSlide(editing.id, formData);
    } else {
      result = await createHeroSlide(formData);
    }

    if (result?.error) setError(result.error);
    else {
      resetForm();
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este slide?")) return;
    await deleteHeroSlide(id);
    if (editing?.id === id) resetForm();
    router.refresh();
  }

  const previewUrl = uploadedUrl || linkUrl;
  const displaySlides = ordered;

  return (
    <div className="space-y-6">
      {/* ─── Formulario crear/editar ─── */}
      <form action={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/70">
            <ImageIcon className="h-4 w-4 text-violet-400" />
            {editing ? "Editar slide" : "Nuevo slide"}
          </h3>
          {editing && (
            <button type="button" onClick={resetForm} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/50">URL de imagen (Pinterest, Unsplash...)</label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://i.pinimg.com/..."
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#050505] px-2 text-xs text-white/30">o sube desde tu PC</span>
          </div>
        </div>

        <MediaUpload folder="hero-slides" onUploaded={setUploadedUrl} label="Subir imagen → Storage" />

        <input
          name="title"
          defaultValue={editing?.title ?? ""}
          placeholder="Título (opcional)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        <input
          name="short_title"
          defaultValue={editing?.short_title ?? ""}
          placeholder="Nombre corto para la navegación (opcional)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        <textarea
          name="description"
          defaultValue={editing?.description ?? ""}
          placeholder="Descripción (opcional)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        <input
          name="order_index"
          type="number"
          defaultValue={editing?.order_index ?? slides.length}
          placeholder="Orden"
          className="w-24 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        {previewUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          {editing ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" /> Guardar cambios
            </span>
          ) : (
            "Agregar slide"
          )}
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>

      {/* ─── Lista ordenable ─── */}
      {slides.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/50">
              Slides del Hero ({slides.length})
            </h3>
            {savingOrder && (
              <span className="font-mono text-xs text-violet-400">Guardando orden…</span>
            )}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displaySlides.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {displaySlides.map((slide) => (
                <SortableSlide
                  key={slide.id}
                  slide={slide}
                  editingId={editing?.id ?? null}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
