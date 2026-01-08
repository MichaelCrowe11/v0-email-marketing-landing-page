"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export const HEADER_HEIGHT = 64

export function GlobalHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-3 md:px-4 max-w-screen-2xl mx-auto gap-3">
        {/* Logo / Brand (Mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-primary/30">
              <Image src="/crowe-avatar.png" alt="Crowe Mycology" fill className="object-cover" priority sizes="28px" />
            </div>
            <span className="font-bold text-sm text-primary">Crowe Mycology</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm md:ml-[272px]">
          <form onSubmit={handleSearch} className="relative">
            <Search
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                searchFocused ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-9 pl-8 pr-10 text-sm bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex">
              <Badge variant="secondary" className="h-4 px-1 text-[9px] font-mono text-muted-foreground">
                ⌘K
              </Badge>
            </div>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <ThemeToggle />
          <UserMenu />
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
