import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 text-sm font-medium">用户名</th>
              <th className="text-left p-3 text-sm font-medium">邮箱</th>
              <th className="text-left p-3 text-sm font-medium">角色</th>
              <th className="text-left p-3 text-sm font-medium">订单数</th>
              <th className="text-left p-3 text-sm font-medium">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3 text-sm font-medium">{u.name}</td>
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3">
                  <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                    {u.role === "ADMIN" ? "管理员" : "用户"}
                  </Badge>
                </td>
                <td className="p-3 text-sm">{u._count.orders}</td>
                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
