"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  galleryItemId: string;
  initialCount?: number;
}

export function LikeButton({ galleryItemId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { count: total } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("gallery_item_id", galleryItemId);

      setCount(total ?? 0);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("gallery_item_id", galleryItemId)
        .eq("user_id", user.id)
        .maybeSingle();

      setLiked(!!data);
    }
    load();

    const channel = supabase
      .channel(`likes:${galleryItemId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter: `gallery_item_id=eq.${galleryItemId}`,
        },
        async () => {
          const { count: total } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("gallery_item_id", galleryItemId);
          setCount(total ?? 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [galleryItemId, supabase]);

  const toggleLike = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("gallery_item_id", galleryItemId)
        .eq("user_id", user.id);
      setLiked(false);
    } else {
      await supabase.from("likes").insert({
        gallery_item_id: galleryItemId,
        user_id: user.id,
      });
      setLiked(true);
      trackEvent("like", { galleryItemId });
    }
    setLoading(false);
  };

  return (
    <button
      data-cursor
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-all",
        liked && "border-rose-500/50 bg-rose-500/10 text-rose-400"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      <span className="text-sm tabular-nums">{count}</span>
    </button>
  );
}
