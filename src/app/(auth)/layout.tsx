import Link from "next/link";

export const runtime = "nodejs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4">
        <Link href="/" className="text-xl font-bold">
          📦 资源栈
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
    </div>
  );
}
