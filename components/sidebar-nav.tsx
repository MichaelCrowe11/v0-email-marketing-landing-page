"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  User,
  MessageSquare,
  DollarSign,
  BookOpen,
  Menu,
  X,
  ShoppingBag,
  ExternalLink,
  LayoutDashboard,
  Microscope,
  ClipboardList,
  Users,
  BarChart3,
  Leaf,
} from "lucide-react"

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/species-library", label: "Species Library", icon: Microscope },
    { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
    { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/forum", label: "Community", icon: Users },
    { href: "/chat", label: "AI Assistant", icon: MessageSquare },
    { href: "/docs", label: "Documentation", icon: BookOpen },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-amber-500/10 hover:border-amber-500/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-background via-background to-amber-950/10 backdrop-blur-xl border-r border-border/50 z-40 transition-transform duration-300 ${
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
                className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/30 transition-all group-hover:scale-105 group-hover:ring-amber-500/50"
              />
            </div>
            <div>
              <div className="text-lg font-semibold bg-gradient-to-r from-amber-200 to-emerald-200 bg-clip-text text-transparent">
                Crowe Logic
              </div>
              <div className="text-xs text-muted-foreground">Mycology AI Platform</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-amber-500/10 rounded-lg transition-all hover:translate-x-1"
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
            <Button size="sm" variant="ghost" className="w-full justify-start gap-3 hover:bg-amber-500/10" asChild>
              <a href="mailto:michael@crowelogic.com">
                <ExternalLink className="w-5 h-5" />
                Contact Michael
              </a>
            </Button>

            <Button size="sm" variant="ghost" className="w-full justify-start gap-3 hover:bg-amber-500/10" asChild>
              <Link href="/profile">
                <User className="w-5 h-5" />
                Profile
              </Link>
            </Button>

            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg"
              asChild
            >
              <Link href="/shop">Get Started</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
