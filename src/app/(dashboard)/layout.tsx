import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Download, User } from "lucide-react";

export const runtime = "nodejs";

const sidebarLinks = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "我的订单", icon: ShoppingBag },
  { href: "/dashboard/downloads", label: "下载记录", icon: Download },
  { href: "/dashboard/profile", label: "个人设置", icon: User },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 shrink-0">
            <h2 className="font-bold text-lg mb-4 px-3">用户中心</h2>
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
      <Footer />
    </>
  );
}
