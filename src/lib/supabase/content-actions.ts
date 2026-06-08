"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "./mappers";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/galerias");
  revalidatePath("/admin");
  revalidatePath("/admin/galerias");
}

export async function createGallery(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  let slug = (formData.get("slug") as string) || slugify(title);
  const description = (formData.get("description") as string) || null;
  const featured = formData.get("featured") === "on";
  const cover_image_url = (formData.get("cover_image_url") as string) || null;

  // Asegurar slug único
  const { count } = await supabase
    .from("galleries")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  if (count && count > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  const { data, error } = await supabase
    .from("galleries")
    .insert({
      title,
      slug,
      description,
      featured,
      cover_image_url,
      published: true,
    })
    .select("id, slug")
    .single();

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true, slug: data.slug, id: data.id };
}

export async function deleteGallery(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("galleries").delete().eq("id", id);
  if (error) return;
  revalidateAll();
}

export async function createVideo(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  let slug = (formData.get("slug") as string) || slugify(title);
  const video_url = formData.get("video_url") as string;
  const poster_url = (formData.get("poster_url") as string) || null;
  const description = (formData.get("description") as string) || null;

  // Asegurar slug único
  const { count } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("slug", slug);

  if (count && count > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  const { error } = await supabase.from("videos").insert({
    title,
    slug,
    video_url,
    poster_url,
    description,
    published: true,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

// ─── Model Images (collage) ───────────────────────────────────

export async function addModelImage(formData: FormData) {
  const supabase = await createClient();
  const hero_room_id = formData.get("hero_room_id") as string;
  const image_url = formData.get("image_url") as string;
  const caption = (formData.get("caption") as string) || null;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  const { error } = await supabase.from("model_images").insert({
    hero_room_id,
    image_url,
    caption,
    order_index,
  });
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteModelImage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_images").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

// ─── Model Audio ──────────────────────────────────────────────

export async function setModelAudio(formData: FormData) {
  const supabase = await createClient();
  const hero_room_id = formData.get("hero_room_id") as string;
  const audio_url = formData.get("audio_url") as string;
  const title = (formData.get("title") as string) || null;

  // Borrar audio existente si hay
  await supabase.from("model_audios").delete().eq("hero_room_id", hero_room_id);

  const { error } = await supabase.from("model_audios").insert({
    hero_room_id,
    audio_url,
    title,
  });
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteModelAudio(hero_room_id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_audios").delete().eq("hero_room_id", hero_room_id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

// ─── Gallery Slots ────────────────────────────────────────────

export async function upsertGallerySlot(formData: FormData) {
  const supabase = await createClient();
  const gallery_id = formData.get("gallery_id") as string;
  const slot_index = parseInt(formData.get("slot_index") as string);
  const cover_image_url = (formData.get("cover_image_url") as string) || undefined;
  const title = (formData.get("title") as string) || undefined;

  const payload: Record<string, unknown> = { gallery_id, slot_index };
  if (cover_image_url !== undefined) payload.cover_image_url = cover_image_url;
  if (title !== undefined) payload.title = title;

  const { data, error } = await supabase
    .from("gallery_slots")
    .upsert(payload, { onConflict: "gallery_id,slot_index" })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true, id: data.id };
}

export async function addSlotItem(formData: FormData) {
  const supabase = await createClient();
  const slot_id = formData.get("slot_id") as string;
  const image_url = formData.get("image_url") as string;
  const title = (formData.get("title") as string) || null;

  const { data: slot } = await supabase
    .from("gallery_slots")
    .select("gallery_id")
    .eq("id", slot_id)
    .single();

  if (!slot) return { error: "Slot no encontrado" };

  const { count } = await supabase
    .from("gallery_items")
    .select("*", { count: "exact", head: true })
    .eq("slot_id", slot_id);

  const { error } = await supabase.from("gallery_items").insert({
    gallery_id: slot.gallery_id,
    slot_id,
    image_url,
    title,
    media_type: "image",
    order_index: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteSlotItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteGallerySlot(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_slots").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

// ─── Model Slots ──────────────────────────────────────────────

export async function upsertModelSlot(formData: FormData) {
  const supabase = await createClient();
  const hero_room_id = formData.get("hero_room_id") as string;
  const slot_index = parseInt(formData.get("slot_index") as string);
  const cover_image_url = (formData.get("cover_image_url") as string) || undefined;
  const title = (formData.get("title") as string) || undefined;

  const payload: Record<string, unknown> = { hero_room_id, slot_index };
  if (cover_image_url !== undefined) payload.cover_image_url = cover_image_url;
  if (title !== undefined) payload.title = title;

  const { data, error } = await supabase
    .from("model_slots")
    .upsert(payload, { onConflict: "hero_room_id,slot_index" })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true, id: data.id };
}

export async function addModelSlotItem(formData: FormData) {
  const supabase = await createClient();
  const slot_id = formData.get("slot_id") as string;
  const image_url = formData.get("image_url") as string;
  const caption = (formData.get("caption") as string) || null;

  // Obtener hero_room_id del slot
  const { data: slot } = await supabase
    .from("model_slots")
    .select("hero_room_id")
    .eq("id", slot_id)
    .single();

  if (!slot) return { error: "Slot no encontrado" };

  const { count } = await supabase
    .from("model_images")
    .select("*", { count: "exact", head: true })
    .eq("slot_id", slot_id);

  const { error } = await supabase.from("model_images").insert({
    hero_room_id: slot.hero_room_id,
    slot_id,
    image_url,
    caption,
    order_index: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteModelSlotItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_images").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateModelSlotItem(formData: FormData) {
  const supabase = await createClient();
  const item_id = formData.get("item_id") as string;
  const caption = (formData.get("caption") as string) || null;

  const { error } = await supabase
    .from("model_images")
    .update({ caption })
    .eq("id", item_id);

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteModelSlot(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_slots").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function addGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const gallery_id = formData.get("gallery_id") as string;
  const image_url = (formData.get("image_url") as string) || null;
  const video_url = (formData.get("video_url") as string) || null;
  const title = (formData.get("title") as string) || null;
  const media_type = video_url ? "video" : "image";

  const { count } = await supabase
    .from("gallery_items")
    .select("*", { count: "exact", head: true })
    .eq("gallery_id", gallery_id);

  const { error } = await supabase.from("gallery_items").insert({
    gallery_id,
    image_url,
    video_url,
    title,
    media_type,
    order_index: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function createHeroRoom(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const short_title = (formData.get("short_title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const accent_color = (formData.get("accent_color") as string) || null;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  const { error } = await supabase.from("hero_rooms").insert({
    title,
    short_title,
    description,
    image_url,
    accent_color,
    order_index,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateHeroRoom(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const short_title = (formData.get("short_title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const accent_color = (formData.get("accent_color") as string) || null;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  const { error } = await supabase
    .from("hero_rooms")
    .update({ title, short_title, description, image_url, accent_color, order_index })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteHeroRoom(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_rooms").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function createHeroSlide(formData: FormData) {
  const supabase = await createClient();
  const image_url = formData.get("image_url") as string;
  const title = (formData.get("title") as string) || null;
  const short_title = (formData.get("short_title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  const { error } = await supabase.from("hero_slides").insert({
    image_url,
    title,
    short_title,
    description,
    order_index,
  });

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateHeroSlide(id: string, formData: FormData) {
  const supabase = await createClient();
  const image_url = formData.get("image_url") as string;
  const title = (formData.get("title") as string) || null;
  const short_title = (formData.get("short_title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  const { error } = await supabase
    .from("hero_slides")
    .update({ image_url, title, short_title, description, order_index })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function reorderHeroSlides(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("hero_slides").update({ order_index: index }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const error = results.find((r) => r.error)?.error;
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const sectionsRaw = formData.get("sections") as string;
  const sections = sectionsRaw ? sectionsRaw.split(",").map((s) => s.trim()) : undefined;

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_title: formData.get("site_title") as string,
      tagline: formData.get("tagline") as string,
      hero_title: formData.get("hero_title") as string,
      hero_subtitle: formData.get("hero_subtitle") as string,
      intro_title: formData.get("intro_title") as string,
      intro_subtitle: formData.get("intro_subtitle") as string,
      intro_text: formData.get("intro_text") as string,
      quienes_somos: formData.get("quienes_somos") as string,
      quienes_somos_desc1: formData.get("quienes_somos_desc1") as string,
      quienes_somos_desc2: formData.get("quienes_somos_desc2") as string,
      por_que: formData.get("por_que") as string,
      por_que_desc1: formData.get("por_que_desc1") as string,
      por_que_desc2: formData.get("por_que_desc2") as string,
      para_que: formData.get("para_que") as string,
      para_que_desc1: formData.get("para_que_desc1") as string,
      para_que_desc2: formData.get("para_que_desc2") as string,
      sections,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidateAll();
  return { success: true };
}
