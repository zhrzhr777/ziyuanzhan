import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminResourcesPage() {
  const resources = await db.resource.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">资源管理</h1>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="mr-2 h-4 w-4" /> 添加资源
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 text-sm font-medium">标题</th>
              <th className="text-left p-3 text-sm font-medium">分类</th>
              <th className="text-left p-3 text-sm font-medium">价格</th>
              <th className="text-left p-3 text-sm font-medium">状态</th>
              <th className="text-left p-3 text-sm font-medium">下载</th>
              <th className="text-left p-3 text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="p-3 text-sm font-medium">{r.title}</td>
                <td className="p-3 text-sm text-muted-foreground">{r.category.name}</td>
                <td className="p-3 text-sm">{r.price > 0 ? `￥${r.price}` : "免费"}</td>
                <td className="p-3">
                  <Badge variant={r.isPublished ? "default" : "secondary"}>
                    {r.isPublished ? "已发布" : "草稿"}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-muted-foreground">{r.downloadCount}</td>
                <td className="p-3 text-sm">
                  <Link href={`/admin/resources/${r.id}/edit`} className="text-primary hover:underline">
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
