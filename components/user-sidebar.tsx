"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Home, FileText, Bell, MessageSquare, PlusCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function UserSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "My Reports",
      icon: FileText,
      href: "/my-reports",
      active: pathname === "/my-reports",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/messages",
      active: pathname === "/messages",
    },
    {
      label: "Report Item",
      icon: PlusCircle,
      href: "/report-item",
      active: pathname === "/report-item",
    },
  ]

  return (
    <div className="hidden lg:flex lg:flex-col h-full border-r bg-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="font-bold text-xl text-[#932e1d]">LOST & FOUND</span>
        </Link>
      </div>
      <div className="flex flex-col px-3 py-2 space-y-1 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
              route.active ? "bg-muted" : "",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.active ? "text-[#932e1d]" : "")} />
            <span className={cn(route.active ? "text-[#932e1d] font-semibold" : "")}>{route.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-auto p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
