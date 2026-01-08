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
  ExternalLink,
  LayoutDashboard,
  Microscope,
  ClipboardList,
  Users,
  Leaf,
  Camera,
  Home,
  Calendar,
} from "lucide-react"
import { HEADER_HEIGHT } from "@/components/global-header"

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/chat", label: "AI Assistant", icon: MessageSquare },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/crowe-vision", label: "Crowe Vision", icon: Camera },
      { href: "/species-library", label: "Species Library", icon: Microscope },
      { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
      { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/forum", label: "Community", icon: Users },
      { href: "/consultations", label: "Consultations", icon: Calendar },
      { href: "/pricing", label: "Pricing", icon: DollarSign },
      { href: "/docs", label: "Documentation", icon: BookOpen },
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
      {/* Mobile Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        className="fixed top-[72px] left-3 z-50 md:hidden h-10 w-10 p-0 bg-sidebar/95 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar-accent shadow-lg"
        style={{ top: `${HEADER_HEIGHT + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-screen w-60 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full pb-3">
          <a
            href="/"
            className="flex items-center px-3 py-2 border-b border-sidebar-border group shrink-0 hover:bg-sidebar-accent/50 transition-colors"
            style={{ height: `${HEADER_HEIGHT}px` }}
          >
            <div className="relative w-9 h-9 flex-shrink-0 mr-2 rounded-full overflow-hidden border-2 border-primary/30">
              <Image
                src="/crowe-avatar.png"
                alt="Crowe Mycology"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
                sizes="36px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-primary">Crowe Mycology</span>
              <span className="text-[9px] text-muted-foreground">by Southwest Mushrooms</span>
            </div>
          </a>

          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.label}>
                <h3 className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-sidebar-border space-y-1.5">
            <Button size="sm" variant="ghost" className="w-full justify-start gap-2 h-8 text-xs" asChild>
              <a href="mailto:Michael@CroweLogic.com">
                <ExternalLink className="w-3.5 h-3.5" />
                Contact Michael
              </a>
            </Button>
            <Button size="sm" variant="ghost" className="w-full justify-start gap-2 h-8 text-xs" asChild>
              <Link href="/profile">
                <User className="w-3.5 h-3.5" />
                Profile
              </Link>
            </Button>
            <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90" asChild>
              <Link href="/pricing">Upgrade Access</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
