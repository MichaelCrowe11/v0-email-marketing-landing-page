"use client"

import { CroweWordmark } from "./crowe-wordmark"
import { SidebarTrigger } from "./ui/sidebar"
import { Button } from "./ui/button"
import { Bell, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"

export function PlatformHeader() {
  const [dateTime, setDateTime] = useState({ date: "", time: "" })

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setDateTime({
        date: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      })
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Sidebar trigger + Wordmark + Clock */}
        <div className="flex items-center gap-6">
          <SidebarTrigger />
          <CroweWordmark variant="full" className="hidden md:flex" />
          <CroweWordmark variant="compact" className="flex md:hidden" />

          {/* Live Clock and Date */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-white/70 border-l border-white/10 pl-6">
            <div className="flex flex-col leading-tight">
              <span className="text-white/90 font-semibold tabular-nums">{dateTime.time}</span>
              <span className="text-white/50 text-[10px]">{dateTime.date}</span>
            </div>
          </div>
        </div>

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
