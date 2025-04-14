import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="grid lg:grid-cols-[240px_1fr] h-screen">
      <AdminSidebar />
      <main className="overflow-auto">{children}</main>
    </div>
  )
}
