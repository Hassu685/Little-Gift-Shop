"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";

export default function ImageUploader({ images = [], onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    setError("");
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i) => onChange(images.filter((_, idx) => idx !== i));

  const moveUp = (i) => {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-lavender/40">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={11} />
            </button>
            {i > 0 && (
              <button
                type="button"
                onClick={() => moveUp(i)}
                aria-label="Move earlier"
                className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <GripVertical size={11} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-lavender/70 text-primary/50 hover:border-primary/50 hover:text-ink/75"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-[10px]">Upload</span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && handleFiles(Array.from(e.target.files))}
      />
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
