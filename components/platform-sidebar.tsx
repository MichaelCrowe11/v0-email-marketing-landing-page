"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "./ui/sidebar"
import { CLMonogram } from "./cl-monogram"
import {
  MessageSquare,
  Code2,
  Microscope,
  Video,
  Database,
  FileText,
  MessageCircle,
  CreditCard,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Talk to Crowe Logic" },
  { href: "/crowe-code", icon: Code2, label: "Crowe Code" },
  { href: "/workbench", icon: Microscope, label: "Research IDE" },
  { href: "/crowe-vision", icon: Video, label: "Crowe Vision" },
  { href: "/video-studio", icon: Video, label: "Video Studio" },
]

const secondaryItems = [
  { href: "/species-library", icon: Database, label: "Species Library" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/forum", icon: MessageCircle, label: "Forum" },
]

const bottomItems = [
  { href: "/pricing", icon: CreditCard, label: "Pricing" },
  { href: "/dashboard", icon: Settings, label: "Dashboard" },
]

export function PlatformSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <CLMonogram />
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Navigation */}
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator />

        {/* Secondary Navigation */}
        <SidebarMenu>
          {secondaryItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="flex-1" />

        <SidebarSeparator />

        {/* Bottom Navigation */}
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
