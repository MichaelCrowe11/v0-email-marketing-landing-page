"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  ChevronDown,
  ChevronRight,
  Plus,
  Upload,
  Beaker,
} from "lucide-react"
import { HEADER_HEIGHT } from "@/components/global-header"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  isNew?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
  defaultOpen?: boolean
}

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { href: "/", label: "Home", icon: Home },
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
      defaultOpen: true,
    },
    {
      title: "AI Tools",
      items: [
        { href: "/chat", label: "Crowe Logic Interface", icon: MessageSquare },
        { href: "/workbench", label: "DeepParallel Workbench", icon: Beaker, isNew: true },
        { href: "/crowe-vision", label: "Crowe Vision", icon: Camera, isNew: true },
        { href: "/video-studio", label: "Video Studio", icon: Video, isNew: true },
        { href: "/gpts", label: "AI GPT Modules", icon: Sparkles },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
      ],
      defaultOpen: true,
    },
    {
      title: "Resources",
      items: [
        { href: "/species-library", label: "Species Library", icon: Microscope },
        { href: "/sops", label: "SOPs & Guides", icon: ClipboardList },
        { href: "/contamination-guide", label: "Contamination ID", icon: Leaf },
        { href: "/docs", label: "Documentation", icon: BookOpen },
      ],
      defaultOpen: true,
    },
    {
      title: "Community",
      items: [
        { href: "/forum", label: "Community Forum", icon: Users },
        { href: "/consultations", label: "Consultations", icon: Calendar },
      ],
      defaultOpen: true,
    },
    {
      title: "Account",
      items: [
        { href: "/pricing", label: "Pricing", icon: DollarSign },
        { href: "/shop", label: "Shop", icon: ShoppingBag },
      ],
      defaultOpen: true,
    },
  ]

  // Initialize collapsed sections
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    navSections.forEach((section) => {
      initial[section.title] = !section.defaultOpen
    })
    setCollapsedSections(initial)
  }, [])

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  // Arrow key navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('nav')) return

      const navLinks = Array.from(document.querySelectorAll('nav a[href]')) as HTMLAnchorElement[]
      const currentIndex = navLinks.indexOf(target as HTMLAnchorElement)

      if (e.key === 'ArrowDown' && currentIndex < navLinks.length - 1) {
        e.preventDefault()
        navLinks[currentIndex + 1]?.focus()
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        navLinks[currentIndex - 1]?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        className={`fixed left-0 h-screen w-64 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

          {/* Navigation - Grouped with collapsible sections */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto" aria-label="Main navigation">
            {navSections.map((section) => {
              const isCollapsed = collapsedSections[section.title]
              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase tracking-wider transition-colors"
                    aria-expanded={!isCollapsed}
                    aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${section.title} section`}
                  >
                    <span>{section.title}</span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {/* Section Items */}
                  {!isCollapsed && (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all group ${active
                                ? "bg-sidebar-accent text-sidebar-foreground shadow-sm ring-1 ring-primary/20"
                                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
                              }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${active ? "scale-110" : "group-hover:scale-105"
                              }`} />
                            <span className="truncate flex-1">{item.label}</span>
                            {item.isNew && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5 bg-primary/10 text-primary border-primary/20"
                              >
                                NEW
                              </Badge>
                            )}
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="px-4 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-center gap-2 hover:bg-sidebar-accent hover:border-primary/30 text-sidebar-foreground h-10"
                asChild
              >
                <Link href="/chat">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">New Chat</span>
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-center gap-2 hover:bg-sidebar-accent hover:border-primary/30 text-sidebar-foreground h-10"
                asChild
              >
                <Link href="/crowe-vision">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs">Upload</span>
                </Link>
              </Button>
            </div>
          </div>

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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all"
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
