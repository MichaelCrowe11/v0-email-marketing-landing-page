"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Calendar,
} from "lucide-react"
import { HEADER_HEIGHT } from "@/components/global-header"

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
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/consultations", label: "Consultations", icon: Calendar },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Toggle Button - positioned below header */}
      <Button
        size="sm"
        variant="ghost"
        className="fixed top-[72px] left-3 z-50 md:hidden h-11 w-11 p-0 bg-sidebar/95 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar-accent shadow-lg"
        style={{ top: `${HEADER_HEIGHT + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar - locked to top with header height offset */}
      <aside
        className={`fixed left-0 h-screen w-64 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full pb-4">
          <a
            href="https://southwestmushrooms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 border-b border-sidebar-border group shrink-0 hover:bg-sidebar-accent/50 transition-colors"
            style={{ height: `${HEADER_HEIGHT}px` }}
          >
            <Image
              src="/southwest-mushrooms-logo.jpg"
              alt="Southwest Mushrooms"
              width={56}
              height={56}
              className="object-contain transition-transform group-hover:scale-105"
            />
          </a>

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
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
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
              <a href="mailto:Michael@CroweLogic.com">
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              asChild
            >
              <Link href="/pricing">Upgrade Access</Link>
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
