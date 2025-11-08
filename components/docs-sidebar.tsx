"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, Code, FileCode, Zap, Shield, GitBranch, ChevronDown } from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    title: "Getting Started",
    items: [{ title: "Overview", href: "/docs/overview", icon: Book }],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Schemas", href: "/docs/schemas", icon: FileCode },
      { title: "Agents", href: "/docs/agents", icon: Zap },
      { title: "Quality Controls", href: "/docs/quality", icon: Shield },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Decision Trees", href: "/docs/decision-trees", icon: GitBranch },
      { title: "Taxonomy", href: "/docs/taxonomy", icon: Code },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(["Getting Started", "Core Concepts", "Advanced"])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto hidden md:block">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
              >
                {section.title}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openSections.includes(section.title) ? "rotate-180" : "",
                  )}
                />
              </button>
              {openSections.includes(section.title) && (
                <ul className="space-y-1 ml-2">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
