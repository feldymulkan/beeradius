// src/app/login/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm"; // Impor komponen form yang baru

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Jika sudah ada sesi (sudah login), arahkan ke halaman yang tidak ada (404)
  if (session) {
    redirect("/404"); // atau redirect("/404")
  }

  // Jika belum login, tampilkan komponen form
  return <LoginForm />;
}