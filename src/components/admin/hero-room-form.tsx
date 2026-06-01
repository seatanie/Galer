"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createHeroRoom,
  updateHeroRoom,
  deleteHeroRoom,
  addModelImage,
  deleteModelImage,
  setModelAudio,
  deleteModelAudio,
} from "@/lib/supabase/content-actions";
import { MediaUpload } from "./media-upload";
import { ModelSlotsEditor } from "./ModelSlotsEditor";

import { Trash2, Layers, Image as ImageIcon, Pencil, X, Music, Plus, Upload } from "lucide-react";
import type { HeroRoom, ModelImage, ModelAudio } from "@/types/supabase-content";

interface RoomWithExtras extends HeroRoom {
  model_images?: ModelImage[];
  model_audios?: ModelAudio[];
  model_slots?: any[];
}

interface Props {
  rooms: RoomWithExtras[];
}

export function HeroRoomForm({ rooms }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<RoomWithExtras | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Estados para collage
  const [collageUrl, setCollageUrl] = useState("");
  const [collageCaption, setCollageCaption] = useState("");

  // Estados para audio
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTitle, setAudioTitle] = useState("");

  function resetForm() {
    setEditing(null);
    setImageUrl("");
    setLinkUrl("");
    setCollageUrl("");
    setCollageCaption("");
    setAudioUrl("");
    setAudioTitle("");
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const finalUrl = imageUrl || linkUrl;
    if (finalUrl) formData.set("image_url", finalUrl);

    let result;
    if (editing) {
      result = await updateHeroRoom(editing.id, formData);
    } else {
      result = await createHeroRoom(formData);
    }

    if (result?.error) setError(result.error);
    else { resetForm(); router.refresh(); }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este modelo?")) return;
    await deleteHeroRoom(id);
    if (editing?.id === id) resetForm();
    router.refresh();
  }

  function startEdit(room: RoomWithExtras) {
    setEditing(room);
    setImageUrl("");
    setLinkUrl(room.image_url ?? "");
    setError(null);
  }

  // ── Collage ──
  async function handleAddCollageImage() {
    if (!editing || !collageUrl) return;
    setError(null);
    const fd = new FormData();
    fd.set("hero_room_id", editing.id);
    fd.set("image_url", collageUrl);
    fd.set("caption", collageCaption);
    fd.set("order_index", String((editing.model_images ?? []).length));
    const result = await addModelImage(fd);
    if (result?.error) setError(result.error);
    else { setCollageUrl(""); setCollageCaption(""); router.refresh(); }
  }

  async function handleDeleteCollageImage(id: string) {
    await deleteModelImage(id);
    router.refresh();
  }

  // ── Audio ──
  async function handleSaveAudio() {
    if (!editing || !audioUrl) return;
    setError(null);
    const fd = new FormData();
    fd.set("hero_room_id", editing.id);
    fd.set("audio_url", audioUrl);
    fd.set("title", audioTitle);
    const result = await setModelAudio(fd);
    if (result?.error) setError(result.error);
    else { setAudioUrl(""); setAudioTitle(""); router.refresh(); }
  }

  async function handleDeleteAudio() {
    if (!editing) return;
    await deleteModelAudio(editing.id);
    router.refresh();
  }

  const currentImages = editing?.model_images ?? [];
  const currentAudio = editing?.model_audios?.[0] ?? null;

  return (
    <div className="space-y-6">
      {/* ─── Formulario principal ─── */}
      <form action={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Layers className="h-4 w-4 text-violet-400" />
            {editing ? "Editar modelo" : "Nuevo modelo"}
          </h3>
          {editing && (
            <button type="button" onClick={resetForm} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <input name="title" required defaultValue={editing?.title ?? ""} placeholder="Nombre del modelo (título principal)" className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
        <input name="short_title" defaultValue={editing?.short_title ?? ""} placeholder="Subtítulo debajo de la bolita (opcional)" className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
        <textarea name="description" defaultValue={editing?.description ?? ""} placeholder="Historia / descripción del modelo" rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
        <div className="flex items-center gap-2">
          <input name="accent_color" type="color" defaultValue={editing?.accent_color ?? "#8b5cf6"} className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-black/40" />
          <input name="order_index" type="number" defaultValue={editing?.order_index ?? rooms.length} placeholder="Orden" className="w-24 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
        </div>

        {/* URL imagen principal */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-white/50"><ImageIcon className="h-3 w-3" /> URL de imagen principal</label>
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={editing?.image_url ?? "https://..."} className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
        </div>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#050505] px-2 text-xs text-white/30">o sube un archivo</span></div></div>
        <MediaUpload folder="hero-rooms" onUploaded={setImageUrl} label="Subir imagen → Storage" />
        {(imageUrl || linkUrl) && <p className="truncate text-xs text-emerald-400">{imageUrl || linkUrl}</p>}
        <button type="submit" className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500">{editing ? "Guardar cambios" : "Crear modelo"}</button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>

      {/* ─── Slots / Carrusel (reemplaza collage) ─── */}
      {editing && (
        <div className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/70">
            <ImageIcon className="h-4 w-4 text-violet-400" />
            Carruseles (3 slots)
          </h3>
          <p className="text-xs text-white/40">
            Cada slot es una columna con su propio carrusel de fotos.
          </p>
          <ModelSlotsEditor
            heroRoomId={editing.id}
            slots={(editing as any).model_slots ?? []}
          />
        </div>
      )}

      {/* ─── Audio (solo en edición) ─── */}
      {editing && (
        <div className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Music className="h-4 w-4 text-violet-400" />
            Audio
          </h3>
          {currentAudio ? (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{currentAudio.title ?? "Audio"}</p>
                <audio controls src={currentAudio.audio_url} className="mt-2 h-8 w-full" />
              </div>
              <button type="button" onClick={handleDeleteAudio} className="ml-2 rounded-lg p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-white/40">Sin audio</p>
          )}
          <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="URL del audio (mp3, ogg, etc.)" className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
          <MediaUpload folder="model-audios" accept="audio/*" onUploaded={setAudioUrl} label="Subir audio → Storage" />
          <input value={audioTitle} onChange={(e) => setAudioTitle(e.target.value)} placeholder="Título del audio" className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30" />
          <button type="button" onClick={handleSaveAudio} className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500">{currentAudio ? "Actualizar audio" : "Guardar audio"}</button>
        </div>
      )}

      {/* ─── Lista de modelos ─── */}
      {rooms.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/50">Modelos existentes</h3>
          {rooms.map((room) => (
            <div key={room.id} className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${editing?.id === room.id ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/5"}`}>
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full" style={{ backgroundColor: room.accent_color ?? "#8b5cf6" }}>
                {room.image_url && <img src={room.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <button type="button" onClick={() => startEdit(room)} className="min-w-0 flex-1 overflow-visible text-left">
                <span className="text-sm text-white break-words">{room.title}</span>
                {room.description && <p className="text-xs text-white/40 break-words line-clamp-1">{room.description}</p>}
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button type="button" onClick={() => startEdit(room)} className="rounded-lg p-2 text-white/40 hover:bg-violet-500/20 hover:text-violet-400"><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => handleDelete(room.id)} className="rounded-lg p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
