import { LivePreviewFrame } from "@/components/admin/live-preview-frame";

export default function AdminPreviewPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-light text-white">Live Preview</h1>
      <p className="mb-8 text-white/50">
        Los cambios en Supabase (DB + Storage) se sincronizan en tiempo real. Edita en{" "}
        <a href="/admin/contenido" className="text-violet-400 hover:underline">
          Contenido
        </a>{" "}
        o{" "}
        <a href="/admin/galerias" className="text-violet-400 hover:underline">
          Galerías
        </a>
        .
      </p>
      <LivePreviewFrame />
    </div>
  );
}
