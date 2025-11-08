"use client"

import { CroweWordmark } from "./crowe-wordmark"
import { SidebarTrigger } from "./ui/sidebar"
import { Button } from "./ui/button"
import { Bell, Settings, User } from "lucide-react"

export function PlatformHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Sidebar trigger + Wordmark */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <CroweWordmark variant="full" className="hidden md:flex" />
          <CroweWordmark variant="compact" className="flex md:hidden" />
        </div>

        {/* Middle: Tagline */}
        <div className="hidden lg:block font-mono text-xs text-white/50 tracking-wider">CriOS DISCOVERY ENGINE</div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-9">
            <Bell className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9">
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9">
            <User className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
