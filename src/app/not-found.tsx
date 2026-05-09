import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="text-xl font-semibold">页面未找到</h2>
        <p className="text-muted-foreground max-w-md">
          你要找的页面不存在，可能已被删除或链接地址有误。
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/resources">浏览资源</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
