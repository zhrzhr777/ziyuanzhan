"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/file-upload";
import { toast } from "sonner";

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // 加载分类列表
  if (!categoriesLoaded) {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setCategoriesLoaded(true);
      })
      .catch(() => setCategoriesLoaded(true));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: form.get("title"),
      slug: form.get("slug") || (form.get("title") as string)?.toLowerCase().replace(/\s+/g, "-"),
      description: form.get("description"),
      content: form.get("content"),
      price: parseFloat((form.get("price") as string) || "0"),
      categoryId: form.get("categoryId"),
      tags: form.get("tags"),
      fileSize: form.get("fileSize"),
      fileType: form.get("fileType"),
      coverImage,
      fileUrl,
      isPublished: form.get("isPublished") === "on",
    };

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "创建失败");
      }
      toast.success("资源创建成功");
      router.push("/admin/resources");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "创建失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">添加资源</h1>
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input id="title" name="title" required placeholder="资源标题" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug（URL标识，不填则自动生成）</Label>
              <Input id="slug" name="slug" placeholder="url-friendly-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">分类 *</Label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>选择分类</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">简介</Label>
              <Textarea id="description" name="description" rows={3} placeholder="资源简介" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">详细内容（Markdown格式）</Label>
              <Textarea id="content" name="content" rows={10} placeholder="## 资源说明&#10;&#10;Markdown格式的详细内容..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">价格（0=免费）</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">标签（逗号分隔）</Label>
                <Input id="tags" name="tags" placeholder="如: 前端,React,教程" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileSize">文件大小</Label>
                <Input id="fileSize" name="fileSize" placeholder="如: 8.5 MB" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileType">文件类型</Label>
                <Input id="fileType" name="fileType" placeholder="如: ZIP / PDF" />
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
              <input type="checkbox" id="isPublished" name="isPublished" defaultChecked />
              <Label htmlFor="isPublished">立即发布</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建资源"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
