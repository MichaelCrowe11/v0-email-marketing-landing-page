"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  User,
  FileText,
  MessageSquare,
  Sparkles,
  DollarSign,
  BookOpen,
  Menu,
  X,
  ShoppingBag,
  ExternalLink,
} from "lucide-react"

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/docs", label: "Docs", icon: BookOpen },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/forum", label: "Forum", icon: MessageSquare },
    { href: "#features", label: "Features", icon: Sparkles },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background/95 backdrop-blur-xl border-r border-border/50 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 p-6 border-b border-border/50 group">
            <div className="relative">
              <img
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-border/50 transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">Crowe Logic</div>
              <div className="text-xs text-foreground/60">Mycology AI</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <Button size="sm" variant="ghost" className="w-full justify-start gap-3" asChild>
              <a href="mailto:michael@crowelogic.com">
                <ExternalLink className="w-5 h-5" />
                Contact Michael
              </a>
            </Button>

            <Button size="sm" variant="ghost" className="w-full justify-start gap-3" asChild>
              <Link href="/profile">
                <User className="w-5 h-5" />
                Profile
              </Link>
            </Button>

            <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href="/shop">Get Started</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
