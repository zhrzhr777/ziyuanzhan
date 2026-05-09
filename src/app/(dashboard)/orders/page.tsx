import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { resource: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">暂无订单</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{order.resource.title}</p>
                  <p className="text-sm text-muted-foreground">
                    订单号: {order.orderNo} · ￥{order.amount} · {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <Badge variant={order.status === "PAID" ? "default" : order.status === "PENDING" ? "secondary" : "outline"}>
                  {order.status === "PAID" ? "已支付" : order.status === "PENDING" ? "待支付" : "已取消"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
