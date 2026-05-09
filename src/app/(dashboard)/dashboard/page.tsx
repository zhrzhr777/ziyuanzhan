import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ShoppingBag, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [orderCount, downloadCount, recentOrders, recentDownloads] = await Promise.all([
    db.order.count({ where: { userId: session.user.id, status: "PAID" } }),
    db.download.count({ where: { userId: session.user.id } }),
    db.order.findMany({
      where: { userId: session.user.id },
      include: { resource: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.download.findMany({
      where: { userId: session.user.id },
      include: { resource: true },
      orderBy: { downloadedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">我的概览</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已购资源</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">下载次数</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">注册时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {session.user.email}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">最近订单</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无订单</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        ￥{order.amount} · {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" :
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status === "PAID" ? "已支付" : order.status === "PENDING" ? "待支付" : "已取消"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">最近下载</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDownloads.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无下载</p>
            ) : (
              <div className="space-y-3">
                {recentDownloads.map((dl) => (
                  <div key={dl.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{dl.resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(dl.downloadedAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <Link
                      href={`/resources/${dl.resource.slug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      再次下载
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
