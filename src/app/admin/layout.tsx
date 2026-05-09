import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, FolderTree, ShoppingBag, Users, Megaphone, Settings } from "lucide-react";

export const runtime = "nodejs";

const sidebarLinks = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/resources", label: "资源管理", icon: FileText },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingBag },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/ads", label: "广告管理", icon: Megaphone },
  { href: "/admin/settings", label: "网站设置", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 shrink-0">
            <h2 className="font-bold text-lg mb-4 px-3 text-red-600">管理后台</h2>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={link.href}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
