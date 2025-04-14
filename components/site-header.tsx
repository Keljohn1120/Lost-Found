import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
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
        </nav>

        <Link href="/login">
          <Button variant="default" className="bg-[#932e1d] hover:bg-[#7a2617]">
            LOGIN
          </Button>
        </Link>
      </div>
    </header>
  )
}
