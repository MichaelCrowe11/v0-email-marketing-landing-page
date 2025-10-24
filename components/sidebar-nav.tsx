"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Camera,
  Video,
  Home,
  Sparkles,
} from "lucide-react"

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "AI Assistant", icon: MessageSquare },
    { href: "/crowe-vision", label: "Crowe Vision", icon: Camera },
    { href: "/video-studio", label: "Video Studio", icon: Video },
    { href: "/gpts", label: "AI GPT Modules", icon: Sparkles },
    { href: "/species-library", label: "Species Library", icon: Microscope },
    { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
    { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/forum", label: "Community", icon: Users },
    { href: "/docs", label: "Documentation", icon: BookOpen },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0 bg-sidebar/80 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 p-6 border-b border-sidebar-border group">
            <div className="relative">
              <img
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-sidebar-border transition-all group-hover:scale-105 group-hover:ring-primary/20"
              />
            </div>
            <div>
              <div className="text-lg font-semibold text-sidebar-foreground">Crowe Logic</div>
              <div className="text-xs text-muted-foreground">Mycology AI Platform</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground"
              asChild
            >
              <a href="mailto:michael@crowelogic.com">
                <ExternalLink className="w-5 h-5" />
                Contact Michael
              </a>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground"
              asChild
            >
              <Link href="/profile">
                <User className="w-5 h-5" />
                Profile
              </Link>
            </Button>

            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glass-strong"
              asChild
            >
              <Link href="/gpts">View AI Modules</Link>
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
