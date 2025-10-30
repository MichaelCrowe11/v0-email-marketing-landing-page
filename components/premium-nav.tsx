"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { User, Menu, X } from "lucide-react"

export function PremiumNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-1 ring-border/50 transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-base md:text-lg font-semibold text-foreground">Crowe Logic</div>
              <div className="text-xs text-muted-foreground">Mycology AI</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/docs", label: "Docs" },
              { href: "/documents", label: "Documents" },
              { href: "/forum", label: "Forum" },
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="hidden sm:flex h-9 w-9 rounded-full p-0" asChild>
              <Link href="/profile">
                <User className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              size="sm"
              className="hidden sm:flex h-9 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full"
              asChild
            >
              <a href="https://buy.stripe.com/9B69AT09jfsf4BOfZgao817" target="_blank" rel="noopener noreferrer">
                Get Access
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              size="sm"
              variant="ghost"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-1">
            {[
              { href: "/docs", label: "Docs" },
              { href: "/documents", label: "Documents" },
              { href: "/forum", label: "Forum" },
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
