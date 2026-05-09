import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { user: true, resource: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 text-sm font-medium">订单号</th>
              <th className="text-left p-3 text-sm font-medium">用户</th>
              <th className="text-left p-3 text-sm font-medium">资源</th>
              <th className="text-left p-3 text-sm font-medium">金额</th>
              <th className="text-left p-3 text-sm font-medium">状态</th>
              <th className="text-left p-3 text-sm font-medium">时间</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="p-3 text-sm font-mono text-xs">{o.orderNo}</td>
                <td className="p-3 text-sm">{o.user.name || o.user.email}</td>
                <td className="p-3 text-sm">{o.resource.title}</td>
                <td className="p-3 text-sm">￥{o.amount}</td>
                <td className="p-3">
                  <Badge variant={o.status === "PAID" ? "default" : o.status === "PENDING" ? "secondary" : "outline"}>
                    {o.status === "PAID" ? "已支付" : o.status === "PENDING" ? "待支付" : "已取消"}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("zh-CN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
