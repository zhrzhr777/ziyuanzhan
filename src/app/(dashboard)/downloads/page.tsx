import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function DownloadsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const downloads = await db.download.findMany({
    where: { userId: session.user.id },
    include: { resource: true },
    orderBy: { downloadedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">下载记录</h1>
      {downloads.length === 0 ? (
        <p className="text-muted-foreground">暂无下载记录</p>
      ) : (
        <div className="space-y-3">
          {downloads.map((dl) => (
            <Card key={dl.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{dl.resource.title}</p>
                  <p className="text-sm text-muted-foreground">
                    下载时间: {new Date(dl.downloadedAt).toLocaleString("zh-CN")}
                  </p>
                </div>
                <Link
                  href={`/resources/${dl.resource.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  查看资源
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
