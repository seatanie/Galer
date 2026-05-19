"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  return { success: true };
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/admin`,
    },
  });
  if (error) return { error: error.message };

  return {
    success:
      "Cuenta creada. Revisa tu email para confirmar (o entra directo si desactivaste la confirmación en Supabase).",
  };
}

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/admin`,
    },
  });
  if (error) return { error: error.message };

  return { success: "Enlace mágico enviado a tu email." };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/admin/login`,
  });
  if (error) return { error: error.message };

  return { success: "Te enviamos un enlace para restablecer la contraseña." };
}

export async function signInWithGoogle() {
  await signInWithOAuth("google");
}

export async function signInWithGithub() {
  await signInWithOAuth("github");
}

async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl()}/auth/callback?next=/admin`,
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateUserRole(userId: string, role: "admin" | "editor" | "viewer") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado." };

  const { data: currentProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((currentProfile as { role: string } | null)?.role !== "admin") {
    return { error: "Solo administradores pueden cambiar roles." };
  }

  const { error } = await supabase.from("users").update({ role }).eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}
