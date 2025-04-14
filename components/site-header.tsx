// components/site-header.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'

export function SiteHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/logo.svg" alt="Lost & Found Logo" width={40} height={40} />
          </Link>
          <Link href="/" className="text-xl font-bold text-[#932e1d]">
            LOST & FOUND
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-foreground/80">
            HOME
          </Link>
          <Link
            href="/report"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80"
          >
            REPORT
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80"
          >
            SEARCH
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80"
          >
            ABOUT
          </Link>
          {session?.user?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground/80"
            >
              ADMIN
            </Link>
          )}
        </nav>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {session.user?.name}
                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                {session.user?.role === 'admin' && (
                  <span className="text-xs bg-[#932e1d] text-white px-2 py-0.5 rounded-full ml-1">
                    Admin
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-items">My Items</Link>
              </DropdownMenuItem>
              {session.user?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-[#932e1d] hover:bg-[#7a2617]">
              LOGIN
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}