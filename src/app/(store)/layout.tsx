import { Header, Footer, MiniCart } from "@/widgets";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <MiniCart />
    </>
  );
}
