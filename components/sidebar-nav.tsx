"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  User,
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
  Calendar,
} from "lucide-react"
import { HEADER_HEIGHT } from "@/components/global-header"
import { CLMonogramAnimated } from "@/components/cl-monogram-animated"

const navGroups = [
  {
    label: "Platform",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/marketplace", label: "AI Models", icon: ShoppingBag },
    ],
  },
  {
    label: "Developer Tools",
    items: [
      {
        href: "/crowe-code",
        label: "Crowe Code",
        customIcon: "/crowe-code-avatar.png",
      },
      { href: "/workbench", label: "Research IDE", icon: Microscope },
      {
        href: "/chat",
        label: "AI Chat",
        customIcon: "/crowe-logic-logo.png",
      },
      { href: "/crowe-vision", label: "Crowe Vision", icon: Camera },
      { href: "/video-studio", label: "Video Studio", icon: Video },
    ],
  },
  {
    label: "Data & Hardware",
    items: [
      { href: "/datasets", label: "Datasets", icon: BarChart3 },
      { href: "/crowe-sense", label: "Crowe-Sense", icon: Leaf },
      { href: "/species-library", label: "Species Library", icon: Microscope },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/docs", label: "Documentation", icon: BookOpen },
      { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
      { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
      { href: "/forum", label: "Community", icon: Users },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/consultations", label: "Consultations", icon: Calendar },
      { href: "/pricing", label: "Pricing", icon: DollarSign },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState(new Date())

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      {/* Mobile Toggle Button */}
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

      {/* Sidebar */}
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
          <div
            className="flex flex-col items-center justify-center px-4 py-4 border-b border-sidebar-border bg-sidebar/50"
            style={{ minHeight: `${HEADER_HEIGHT + 20}px` }}
          >
            <div className="flex items-center justify-center mb-3">
              <CLMonogramAnimated size="md" />
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-sm font-mono font-semibold tabular-nums text-sidebar-foreground">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs font-mono tabular-nums text-sidebar-foreground/60">{formatDate(currentTime)}</div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto" aria-label="Main menu">
            {navGroups.map((group) => (
              <div key={group.label}>
                <h3 className="px-4 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          active
                            ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
                        }`}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.customIcon ? (
                          <div className="relative w-5 h-5 flex-shrink-0">
                            <Image
                              src={item.customIcon || "/placeholder.svg"}
                              alt={item.label}
                              fill
                              className="object-contain rounded-full"
                              sizes="20px"
                            />
                          </div>
                        ) : item.icon ? (
                          <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        ) : null}
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
