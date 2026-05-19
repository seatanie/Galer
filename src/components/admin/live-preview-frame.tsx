"use client";

export function LivePreviewFrame() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <p className="font-mono text-xs tracking-widest text-white/50">LIVE PREVIEW</p>
        <button
          type="button"
          onClick={() => {
            const iframe = document.getElementById("galer-preview") as HTMLIFrameElement;
            iframe?.contentWindow?.postMessage("supabase:refresh", "*");
          }}
          className="rounded-lg border border-violet-500/30 px-3 py-1 text-xs text-violet-300 hover:bg-violet-500/10"
        >
          Refrescar
        </button>
      </div>
      <iframe
        id="galer-preview"
        src={`${siteUrl}?preview=true`}
        className="flex-1 w-full bg-black"
        title="Vista previa en vivo"
      />
    </div>
  );
}
