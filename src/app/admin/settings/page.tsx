import { db } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await db.siteSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">网站设置</h1>
      <div className="max-w-lg space-y-4">
        <div className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">网站名称</span>
          <span className="text-muted-foreground">{settingsMap.siteName || "资源栈"}</span>
        </div>
        <div className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">网站描述</span>
          <span className="text-muted-foreground">{settingsMap.siteDescription || "-"}</span>
        </div>
        <div className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">SEO关键词</span>
          <span className="text-muted-foreground">{settingsMap.seoKeywords || "-"}</span>
        </div>
        <div className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">联系邮箱</span>
          <span className="text-muted-foreground">{settingsMap.contactEmail || "-"}</span>
        </div>
        <div className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">支付开关</span>
          <span className="text-muted-foreground">{settingsMap.paymentEnabled === "true" ? "已开启" : "已关闭"}</span>
        </div>
      </div>
    </div>
  );
}
