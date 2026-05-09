import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminAdsPage() {
  const slots = await db.adSlot.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">广告管理</h1>
      <div className="space-y-3">
        {slots.map((slot) => (
          <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{slot.name}</p>
              <p className="text-xs text-muted-foreground">位置: {slot.position}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={slot.isActive ? "default" : "secondary"}>
                {slot.isActive ? "已激活" : "未激活"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
