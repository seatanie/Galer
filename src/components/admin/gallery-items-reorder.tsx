"use client";

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
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types/database";

function SortableItem({ item }: { item: GalleryItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-white/40">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-sm text-white">{item.title ?? item.id.slice(0, 8)}</span>
      <span className="ml-auto font-mono text-xs text-white/30">#{item.order_index}</span>
    </div>
  );
}

export function GalleryItemsReorder({
  galleryId,
  initialItems,
}: {
  galleryId: string;
  initialItems: GalleryItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      order_index: idx,
    }));
    setItems(reordered);
    setSaving(true);

    for (const item of reordered) {
      await supabase
        .from("gallery_items")
        .update({ order_index: item.order_index })
        .eq("id", item.id);
    }
    setSaving(false);
  }

  if (!items.length) {
    return <p className="text-sm text-white/40">Sin ítems en esta galería.</p>;
  }

  return (
    <div>
      {saving && (
        <p className="mb-2 font-mono text-xs text-violet-400">Guardando orden…</p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
