"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  type: "cover" | "resource";
  value?: string;
  onChange: (url: string) => void;
}

export function FileUpload({ type, value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleUpload = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "上传失败");
        }

        const data = await res.json();
        onChange(data.url);
        setPreview(data.url);
        toast.success("上传成功");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "上传失败");
      } finally {
        setLoading(false);
      }
    },
    [type, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const accept =
    type === "cover" ? "image/*" : ".zip,.rar,.7z,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.psd,.ai,.eps,.svg,.mp4";

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          {type === "cover" ? (
            <img src={preview} alt="预览" className="w-40 h-40 object-cover rounded-lg border" />
          ) : (
            <div className="w-40 h-20 flex items-center justify-center border rounded-lg bg-muted text-sm text-muted-foreground px-2 text-center break-all">
              {preview.split("/").pop()}
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={() => {
              onChange("");
              setPreview("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary/50 ${
            loading ? "opacity-50" : ""
          } ${type === "cover" ? "w-40 h-40" : "w-full h-20"}`}
          onClick={() => !loading && document.getElementById(`file-input-${type}`)?.click()}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                {type === "cover" ? "上传封面" : "拖拽或点击上传文件"}
              </span>
              <span className="text-xs text-muted-foreground/60">
                {type === "cover" ? "图片" : "100MB以内"}
              </span>
            </>
          )}
          <input
            id={`file-input-${type}`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
