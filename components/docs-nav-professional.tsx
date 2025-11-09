"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Search, BookOpen, Code, Zap, Database, Microscope, Terminal, Package, FileCode } from "lucide-react"

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  title: string
  href: string
  icon?: any
  badge?: string
}

const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Quick Start", href: "/docs/getting-started", icon: Zap },
      { title: "Platform Overview", href: "/docs/overview", icon: Microscope },
    ],
  },
  {
    title: "Core Platform",
    items: [
      { title: "AI Models", href: "/docs/ai-models", icon: Code, badge: "150+" },
      { title: "Playground", href: "/docs/playground", icon: Terminal, badge: "New" },
      { title: "Workspaces", href: "/docs/workspaces", icon: Package },
      { title: "Datasets", href: "/docs/datasets", icon: Database },
    ],
  },
  {
    title: "Developer Tools",
    items: [
      { title: "Synapse Lang", href: "/docs/synapse-lang", icon: Code },
      { title: "Crowe Code", href: "/docs/crowe-code", icon: FileCode },
      { title: "Research IDE", href: "/docs/research-ide", icon: Terminal },
      { title: "API Reference", href: "/docs/api", icon: Code },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Agents", href: "/docs/agents" },
      { title: "Output Schemas", href: "/docs/schemas" },
      { title: "Quality Controls", href: "/docs/quality" },
    ],
  },
]

export function DocsNavProfessional() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Core Platform": true,
    "Developer Tools": false,
    "Advanced": false,
  })

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const isActive = (href: string) => {
    if (href === "/docs") return pathname === "/docs"
    return pathname?.startsWith(href)
  }

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background overflow-y-auto z-30">
      <div className="p-6 border-b border-border">
        <Link href="/docs" className="flex items-center gap-2 group">
          <BookOpen className="w-5 h-5 text-foreground" />
          <span className="font-semibold text-foreground">Documentation</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-4 space-y-6">
        {navigation.map((section) => {
          const isExpanded = expandedSections[section.title]

          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                          active
                            ? "bg-foreground text-background font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                            active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="space-y-1 text-xs">
          <Link
            href="/playground"
            className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Try Playground →
          </Link>
          <Link
            href="/workspaces"
            className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Workspace →
          </Link>
        </div>
      </div>
    </nav>
  )
}
