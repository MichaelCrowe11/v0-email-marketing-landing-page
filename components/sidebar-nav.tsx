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
  Code2,
} from "lucide-react"
import { HEADER_HEIGHT } from "@/components/global-header"

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/ide", label: "Cultivation IDE", icon: Code2 },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/chat", label: "AI Assistant", icon: MessageSquare },
      { href: "/crowe-vision", label: "Crowe Vision", icon: Camera },
      { href: "/video-studio", label: "Video Studio", icon: Video },
      { href: "/gpts", label: "AI GPT Modules", icon: Sparkles },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/species-library", label: "Species Library", icon: Microscope },
      { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
      { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
      { href: "/docs", label: "Documentation", icon: BookOpen },
    ],
  },
  {
    label: "Community & Services",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/forum", label: "Community", icon: Users },
      { href: "/consultations", label: "Consultations", icon: Calendar },
      { href: "/pricing", label: "Pricing", icon: DollarSign },
      { href: "/shop", label: "Shop", icon: ShoppingBag },
    ],
  },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

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
        aria-expanded={isOpen}
        aria-controls="sidebar-navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar - locked to top with header height offset */}
      <aside
        id="sidebar-navigation"
        className={`fixed left-0 h-screen w-64 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ top: 0 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full pb-4">
          <a
            href="/"
            className="flex items-center px-4 py-3 border-b border-sidebar-border group shrink-0 hover:bg-sidebar-accent/50 transition-colors"
            style={{ height: `${HEADER_HEIGHT}px` }}
            aria-label="Crowe Mycology Home"
          >
            <div className="relative w-12 h-12 flex-shrink-0 mr-2 rounded-xl overflow-hidden bg-[#f5f0e8] border border-primary/20">
              <Image
                src="/southwest-mushrooms-logo.png"
                alt="Southwest Mushrooms"
                fill
                className="object-contain p-1 transition-transform group-hover:scale-105"
                priority
                sizes="48px"
              />
            </div>
            <div className="relative w-10 h-10 flex-shrink-0 mr-2 rounded-full overflow-hidden border-2 border-primary/30">
              <Image
                src="/crowe-avatar.png"
                alt="Crowe Mycology"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
                sizes="40px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-primary group-hover:text-primary/80 transition-colors">
                Crowe Mycology
              </span>
              <span className="text-[10px] text-muted-foreground">by Southwest Mushrooms</span>
            </div>
          </a>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto" aria-label="Main menu">
            {navGroups.map((group) => (
              <div key={group.label}>
                <h3 className="px-4 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
                        }`}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
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
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
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
                <User className="w-5 h-5" aria-hidden="true" />
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
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
