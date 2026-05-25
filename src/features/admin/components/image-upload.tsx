"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024; // mirror the bucket's file_size_limit
const ACCEPT = "image/jpeg,image/png,image/webp";
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Admin image picker backed by the public `media` Supabase Storage bucket.
 * Uploads client-side with the authenticated browser session (storage RLS
 * allows `to authenticated` writes), then hands the public URL up via onChange.
 * A paste-URL fallback stays available for externally hosted images.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "news",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!EXT[file.type]) {
      toast.error("JPEG, PNG, эсвэл WEBP зураг оруулна уу.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Зургийн хэмжээ 5MB-ээс хэтрэхгүй байх ёстой.");
      return;
    }

    setUploading(true);
    // UUID-per-upload: never reuse a path (the CDN caches public URLs hard) and
    // never trust the original filename.
    const path = `${folder}/${crypto.randomUUID()}.${EXT[file.type]}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    setUploading(false);

    if (error) {
      toast.error("Зураг байршуулахад алдаа гарлаа.");
      console.error("image upload", error);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Зураг байршууллаа.");
  }

  return (
    <div className="grid gap-3">
      {value ? (
        <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden border border-border bg-paper">
          <Image
            src={value}
            alt="Сонгосон зураг"
            fill
            sizes="384px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full max-w-sm items-center justify-center border border-dashed border-border bg-paper text-[11px] uppercase tracking-[0.1em] text-charcoal-muted">
          Зураг сонгоогүй
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = ""; // allow re-selecting the same file
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Байршуулж байна…" : value ? "Зураг солих" : "Зураг байршуулах"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            Устгах
          </Button>
        )}
      </div>

      <Input
        type="url"
        placeholder="эсвэл зургийн URL буулгах: https://…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0"
      />
    </div>
  );
}
