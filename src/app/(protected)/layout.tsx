// src/app/(protected)/layout.tsx
import Navbar from "@/components/Navbar"; // Navbar yang akan kita buat

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}