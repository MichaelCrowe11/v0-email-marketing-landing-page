"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchDropdown } from "@/components/search-dropdown"
import { useShopify } from "@/hooks/use-shopify"
import Link from "next/link"

import { HEADER_HEIGHT } from "@/lib/layout-constants"
export { HEADER_HEIGHT }

export function GlobalHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>(null)
  const { searchProducts, createCheckout } = useShopify()

  const results = searchQuery.trim().length >= 2 ? searchProducts(searchQuery) : []

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
      setDropdownVisible(false)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current)
    setSearchFocused(true)
    setDropdownVisible(true)
  }

  const handleBlur = () => {
    setSearchFocused(false)
    blurTimeout.current = setTimeout(() => setDropdownVisible(false), 200)
  }

  const handleBuy = (variantId: string) => {
    setDropdownVisible(false)
    setSearchQuery("")
    createCheckout(variantId)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-3 md:px-4 max-w-screen-2xl mx-auto gap-3">
        {/* Logo / Brand (Mobile) */}
        <div className="md:hidden flex items-center gap-2 pl-12">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/30">
              <Image src="/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover scale-[1.4] object-[center_15%]" priority sizes="32px" />
            </div>
            <span className="font-bold text-sm text-primary">Crowe Logic AI</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm md:ml-[272px] relative">
          <form onSubmit={handleSearch} className="relative">
            <Search
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                searchFocused ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="h-9 pl-8 pr-10 text-sm bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex">
              <Badge variant="secondary" className="h-4 px-1 text-[9px] font-mono text-muted-foreground">
                ⌘K
              </Badge>
            </div>
          </form>
          <SearchDropdown
            products={results}
            visible={dropdownVisible && results.length > 0}
            onBuy={handleBuy}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
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
