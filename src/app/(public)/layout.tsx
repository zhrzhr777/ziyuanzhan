import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const runtime = "nodejs";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
