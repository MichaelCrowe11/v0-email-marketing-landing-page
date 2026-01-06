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

export const HEADER_HEIGHT = 72 // px

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
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6 max-w-screen-2xl mx-auto gap-4">
        {/* Logo / Brand (Mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/crowe-logic-logo.png"
                alt="Crowe Mycology"
                fill
                className="object-contain"
                priority
                sizes="32px"
              />
            </div>
            <span className="font-bold text-lg">Crowe Mycology</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md md:ml-[272px]">
          <form onSubmit={handleSearch} className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                searchFocused ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              type="search"
              placeholder="Search documentation, datasets, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-9 pr-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex">
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </Badge>
            </div>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ide">IDE</Link>
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <ThemeToggle />
          <UserMenu />
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
