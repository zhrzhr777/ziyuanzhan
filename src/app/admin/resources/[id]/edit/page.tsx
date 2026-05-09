"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/file-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, resRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/resources/${id}`),
        ]);
        const catData = await catRes.json();
        setCategories(catData);

        const resData = await resRes.json();
        setTitle(resData.title || "");
        setDescription(resData.description || "");
        setContent(resData.content || "");
        setPrice(String(resData.price || 0));
        setCategoryId(resData.categoryId || "");
        setTags(resData.tags || "");
        setFileSize(resData.fileSize || "");
        setFileType(resData.fileType || "");
        setCoverImage(resData.coverImage || "");
        setFileUrl(resData.fileUrl || "");
        setIsPublished(resData.isPublished ?? true);
      } catch {
        toast.error("加载资源数据失败");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, content,
          price: parseFloat(price) || 0,
          categoryId, tags, fileSize, fileType,
          coverImage, fileUrl, isPublished,
        }),
      });
      if (!res.ok) throw new Error("保存失败");
      toast.success("保存成功");
      router.push("/admin/resources");
      router.refresh();
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定删除这个资源吗？此操作不可撤销。")) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("删除失败");
      toast.success("已删除");
      router.push("/admin/resources");
      router.refresh();
    } catch {
      toast.error("删除失败");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑资源</h1>
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">分类 *</Label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="" disabled>选择分类</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">简介</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">详细内容（Markdown格式）</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">价格（0=免费）</Label>
                <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">标签</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="前端,React,教程" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileSize">文件大小</Label>
                <Input id="fileSize" value={fileSize} onChange={(e) => setFileSize(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileType">文件类型</Label>
                <Input id="fileType" value={fileType} onChange={(e) => setFileType(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>封面图片</Label>
              <FileUpload type="cover" value={coverImage} onChange={setCoverImage} />
            </div>
            <div className="space-y-2">
              <Label>资源文件</Label>
              <FileUpload type="resource" value={fileUrl} onChange={setFileUrl} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <Label htmlFor="isPublished">发布</Label>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button type="button" variant="destructive" onClick={handleDelete}>
                删除资源
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "保存中..." : "保存修改"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
