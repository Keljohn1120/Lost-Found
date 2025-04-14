import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { UserSidebar } from "@/components/user-sidebar"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid lg:grid-cols-[240px_1fr] h-screen">
      <UserSidebar />
      <main className="overflow-auto">{children}</main>
    </div>
  )
}
