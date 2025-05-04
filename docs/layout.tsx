import type { ReactNode } from "react";
import Image from "next/image";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-center gap-2 py-4 shadow font-semibold text-sm bg-white">
        <Image src="/logo.webp" alt="Plum Cave" width={17} height={17} />
        Maxim Bortnikov
      </nav>
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
